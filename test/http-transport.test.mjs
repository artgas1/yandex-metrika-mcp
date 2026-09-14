import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer, request } from 'node:http';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

async function freePort() {
  const probe = createServer();
  await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function waitUntilListening(child) {
  await new Promise((resolve, reject) => {
    let stderr = '';
    const timer = setTimeout(() => reject(new Error(`HTTP server не поднялся:\n${stderr}`)), 10_000);
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      if (stderr.includes('Слушаю http://')) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`HTTP server завершился с кодом ${code}:\n${stderr}`));
    });
  });
}

async function stop(child) {
  if (child.exitCode !== null) return;
  child.kill('SIGTERM');
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      resolve();
    }, 5_000);
    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function listTools(url, name) {
  const client = new Client({ name, version: '1.0.0' });
  const transport = new StreamableHTTPClientTransport(new URL(url));
  try {
    await client.connect(transport);
    return await client.listTools();
  } finally {
    await client.close();
  }
}

function foreignHostStatus(port) {
  return new Promise((resolve, reject) => {
    const req = request({
      host: '127.0.0.1',
      port,
      path: '/mcp',
      method: 'POST',
      headers: {
        host: 'attacker.example',
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
      },
    }, (res) => {
      res.resume();
      res.once('end', () => resolve(res.statusCode));
    });
    req.once('error', reject);
    req.end(JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'host-check', version: '1.0.0' },
      },
    }));
  });
}

test('HTTP transport обслуживает две независимые сессии одним процессом и режет чужой Host', async () => {
  const port = await freePort();
  const child = spawn(process.execPath, ['build/index.js'], {
    cwd: new URL('..', import.meta.url),
    env: {
      ...process.env,
      YANDEX_API_KEY: 'stub-token',
      MCP_TRANSPORT: 'http',
      MCP_HOST: '127.0.0.1',
      MCP_PORT: String(port),
    },
    stdio: ['ignore', 'ignore', 'pipe'],
  });

  try {
    await waitUntilListening(child);
    const url = `http://127.0.0.1:${port}/mcp`;
    const [first, second] = await Promise.all([
      listTools(url, 'http-test-1'),
      listTools(url, 'http-test-2'),
    ]);
    assert.ok(first.tools.length > 1);
    assert.deepEqual(first.tools.map((tool) => tool.name), second.tools.map((tool) => tool.name));
    assert.equal(child.exitCode, null, 'оба клиента должны обслуживаться тем же живым процессом');
    assert.equal(await foreignHostStatus(port), 403, 'DNS rebinding guard обязан отклонить чужой Host');
  } finally {
    await stop(child);
  }
});
