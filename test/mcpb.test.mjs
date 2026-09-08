/**
 * Контракт MCPB-бандла.
 *
 * Бандл — вторая копия сервера, которую устанавливают в один клик. Копия
 * расходится с оригиналом молча: версия в манифесте отстаёт от package.json,
 * список инструментов — от профиля, ссылка на политику приватности указывает в
 * файл, которого уже нет. Ни один из этих отказов не виден на нашей машине —
 * они видны у того, кто поставил бандл.
 *
 * Поэтому проверяется не «собралось», а совпадение манифеста с источниками, из
 * которых работает сам сервер.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

let manifest;
test('манифест собирается из package.json и профиля', () => {
  // Без --pack: собираем staging и манифест, но не зовём npx за упаковщиком.
  execFileSync('node', ['tools/build-mcpb.mjs'], { cwd: root, stdio: 'pipe' });
  manifest = JSON.parse(readFileSync(join(root, '.mcpb-build/manifest.json'), 'utf8'));
  assert.equal(manifest.manifest_version, '0.3');
});

test('версия в манифесте равна версии пакета', () => {
  assert.equal(manifest.version, pkg.version, 'манифест бандла разошёлся с package.json');
});

test('объявленные инструменты совпадают с профилем по умолчанию', async () => {
  const { CORE_TOOLS } = await import(join(root, 'build/profiles.js'));
  const { CATALOG_TOOL } = await import(join(root, 'build/catalog.js'));
  // Сверяем с тем, что реально окажется в tools/list, а не только с CORE_TOOLS:
  // служебный каталог объявляется наравне с методами API.
  assert.deepEqual(
    manifest.tools.map((t) => t.name).sort(),
    [...CORE_TOOLS, CATALOG_TOOL].sort(),
    'список инструментов бандла разошёлся с тем, что объявляет сервер',
  );
  assert.ok(
    manifest.tools.every((t) => typeof t.description === 'string' && t.description.length > 0),
    'инструмент без описания',
  );
});

test('токен объявлен как секрет и обязателен — иначе клиент покажет его открытым полем', () => {
  const key = manifest.user_config?.api_key;
  assert.ok(key, 'в user_config нет api_key');
  assert.equal(key.sensitive, true);
  assert.equal(key.required, true);
  assert.equal(manifest.server.mcp_config.env.YANDEX_API_KEY, '${user_config.api_key}');
});

test('запись через бандл включить нельзя', () => {
  // Цена ошибочного вызова — удалённый счётчик или цель без возможности
  // восстановить историю. Переключателю этого в окне установки не место:
  // нужна запись — ставится пакет с npm.
  const asText = JSON.stringify(manifest);
  assert.ok(!asText.includes('METRIKA_ALLOW_WRITES'), 'бандл предлагает включить запись');
  const profiles = manifest.user_config?.profile;
  assert.equal(profiles.default, 'core');
});

test('политика приватности существует и лежит по HTTPS', () => {
  assert.ok(Array.isArray(manifest.privacy_policies) && manifest.privacy_policies.length >= 1);
  assert.ok(
    manifest.privacy_policies.every((u) => u.startsWith('https://')),
    'каталог требует именно HTTPS-ссылки',
  );
  assert.ok(existsSync(join(root, 'PRIVACY.md')), 'ссылка ведёт в файл, которого нет в репозитории');
  // Раздел в README — отдельное требование каталога, рядом с массивом в манифесте.
  assert.match(readFileSync(join(root, 'README.md'), 'utf8'), /Политика приватности/);
  assert.match(readFileSync(join(root, 'README.en.md'), 'utf8'), /Privacy Policy/);
});

test('в staging попал код и спека, а не только манифест', () => {
  for (const f of ['build/index.js', 'build/profiles.js', 'spec/metrika-api.json', 'package.json']) {
    assert.ok(existsSync(join(root, '.mcpb-build', f)), `в бандле нет ${f}`);
  }
  const staged = JSON.parse(readFileSync(join(root, '.mcpb-build/package.json'), 'utf8'));
  assert.deepEqual(staged.dependencies, pkg.dependencies);
  assert.equal(staged.devDependencies, undefined, 'dev-зависимости уехали в бандл');
});

test('манифест проходит схему официального упаковщика', () => {
  // Наши проверки выше — про совпадение с источниками. Эта — про то, что файл
  // вообще примут: схему держит Anthropic, и она меняется не по нашему графику.
  const out = execFileSync('npx', ['--yes', '@anthropic-ai/mcpb@2', 'validate', '.mcpb-build/manifest.json'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  assert.match(out, /validation passes/i);
});
