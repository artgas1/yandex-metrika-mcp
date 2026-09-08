/**
 * Минимальный клиент JSON-RPC поверх stdio — ровно тот транспорт, по которому
 * с сервером говорит Claude Code. Нужен потому, что вызов внутренней функции
 * ничего не доказывает про протокол: сервер может собираться, проходить
 * юнит-тесты и при этом не отвечать на initialize.
 */
import { spawn } from 'node:child_process';

export const PROTOCOL_VERSION = '2025-06-18';

export class McpStdioClient {
  #child;
  #buffer = '';
  #pending = new Map();
  #nextId = 1;
  #closed = false;

  stderr = '';

  constructor(command, args, env) {
    this.#child = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, ...env },
    });
    this.#child.stdout.setEncoding('utf8');
    this.#child.stderr.setEncoding('utf8');
    this.#child.stdout.on('data', (chunk) => this.#onStdout(chunk));
    this.#child.stderr.on('data', (chunk) => {
      this.stderr += chunk;
    });
    this.#child.on('exit', (code) => {
      this.#closed = true;
      for (const { reject } of this.#pending.values()) {
        reject(new Error(`сервер завершился с кодом ${code}; stderr: ${this.stderr.trim()}`));
      }
      this.#pending.clear();
    });
  }

  #onStdout(chunk) {
    this.#buffer += chunk;
    let nl;
    while ((nl = this.#buffer.indexOf('\n')) !== -1) {
      const line = this.#buffer.slice(0, nl).trim();
      this.#buffer = this.#buffer.slice(nl + 1);
      if (!line) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        // Единственное правило stdio: в stdout только JSON-RPC. Мусор здесь —
        // это сломанный протокол, а не косметика, поэтому валим громко.
        throw new Error(`в stdout не JSON-RPC: ${line.slice(0, 200)}`);
      }
      const waiter = this.#pending.get(msg.id);
      if (!waiter) continue;
      this.#pending.delete(msg.id);
      if (msg.error) waiter.reject(new Error(`JSON-RPC error ${msg.error.code}: ${msg.error.message}`));
      else waiter.resolve(msg.result);
    }
  }

  #send(payload) {
    if (this.#closed) throw new Error('сервер уже закрыт');
    this.#child.stdin.write(`${JSON.stringify(payload)}\n`);
  }

  notify(method, params) {
    this.#send({ jsonrpc: '2.0', method, params });
  }

  request(method, params, timeoutMs = 15_000) {
    const id = this.#nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#pending.delete(id);
        reject(new Error(`таймаут ${timeoutMs} мс на ${method}; stderr: ${this.stderr.trim()}`));
      }, timeoutMs);
      this.#pending.set(id, {
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e) => {
          clearTimeout(timer);
          reject(e);
        },
      });
      this.#send({ jsonrpc: '2.0', id, method, params });
    });
  }

  async initialize(clientName = 'protocol-check') {
    const result = await this.request('initialize', {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: clientName, version: '0.0.0' },
    });
    this.notify('notifications/initialized', {});
    return result;
  }

  /** Полный список инструментов со всеми страницами курсора. */
  async listAllTools() {
    const tools = [];
    let cursor;
    let pages = 0;
    do {
      const page = await this.request('tools/list', cursor ? { cursor } : {});
      tools.push(...page.tools);
      cursor = page.nextCursor;
      if (++pages > 50) throw new Error('пагинация tools/list не сходится');
    } while (cursor);
    return tools;
  }

  callTool(name, args) {
    return this.request('tools/call', { name, arguments: args });
  }

  close() {
    this.#closed = true;
    this.#child.kill('SIGTERM');
  }
}

export function startServer(env = {}) {
  return new McpStdioClient(process.execPath, ['./build/index.js'], env);
}
