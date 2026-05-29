#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(TOOL_DIR, 'config.json');
const DEFAULT_COMMAND = 'once';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function expandHome(input) {
  if (!input) return input;
  if (input === '~') return os.homedir();
  if (input.startsWith('~/')) return path.join(os.homedir(), input.slice(2));
  return input;
}

function loadConfig() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  const appSupportDir = expandHome(config.appSupportDir);
  const logDir = expandHome(config.logDir);
  return {
    ...config,
    appSupportDir,
    logDir,
    profileDir: path.join(appSupportDir, 'chrome-profile'),
    statePath: path.join(appSupportDir, 'state.json'),
    lockPath: path.join(appSupportDir, 'monitor.lock'),
    lastResultPath: path.join(appSupportDir, 'last-result.json'),
    lastHtmlPath: path.join(appSupportDir, 'last.html'),
  };
}

function ensureRuntimeDirs(config) {
  mkdirSync(config.appSupportDir, { recursive: true });
  mkdirSync(config.profileDir, { recursive: true });
  mkdirSync(config.logDir, { recursive: true });
}

function readJson(filePath, fallback) {
  try {
    if (!existsSync(filePath)) return fallback;
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function nowIso() {
  return new Date().toISOString();
}

function appleScriptQuote(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function notify(title, subtitle, message) {
  const script =
    `display notification "${appleScriptQuote(message)}" ` +
    `with title "${appleScriptQuote(title)}" ` +
    `subtitle "${appleScriptQuote(subtitle)}"`;
  const result = spawnSync('/usr/bin/osascript', ['-e', script], { encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`osascript notification failed: ${result.stderr || result.stdout}`);
  }
}

function openCart(config) {
  const child = spawn(
    config.chromePath,
    [
      `--user-data-dir=${config.profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      config.url,
    ],
    { detached: true, stdio: 'ignore' }
  );
  child.unref();
}

function acquireLock(config) {
  const staleAfterMs = Math.max(config.checkTimeoutMs * 2, 120000);
  if (existsSync(config.lockPath)) {
    const lock = readJson(config.lockPath, null);
    const createdAt = lock?.createdAt ? Date.parse(lock.createdAt) : 0;
    if (!Number.isFinite(createdAt) || Date.now() - createdAt > staleAfterMs) {
      rmSync(config.lockPath, { force: true });
    } else {
      return false;
    }
  }
  writeFileSync(config.lockPath, JSON.stringify({ pid: process.pid, createdAt: nowIso() }), { flag: 'wx' });
  return true;
}

function releaseLock(config) {
  rmSync(config.lockPath, { force: true });
}

async function waitForDevToolsPort(profileDir, timeoutMs) {
  const activePortPath = path.join(profileDir, 'DevToolsActivePort');
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (existsSync(activePortPath)) {
      const [port] = readFileSync(activePortPath, 'utf8').trim().split(/\r?\n/);
      if (port) return port;
    }
    await sleep(200);
  }
  throw new Error('Chrome DevToolsActivePort was not created. Close the setup Chrome window if it is still open.');
}

async function waitForPageTarget(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
      if (page) return page;
    } catch (error) {
      lastError = error;
    }
    await sleep(300);
  }
  throw new Error(`Chrome page target was not available${lastError ? `: ${lastError.message}` : ''}`);
}

class CdpClient {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl;
    this.nextId = 1;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.webSocketUrl);
    this.ws.addEventListener('message', (event) => this.handleMessage(event));
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
  }

  handleMessage(event) {
    const payload = JSON.parse(event.data);
    if (!payload.id) return;
    const pending = this.pending.get(payload.id);
    if (!pending) return;
    this.pending.delete(payload.id);
    if (payload.error) {
      pending.reject(new Error(payload.error.message || JSON.stringify(payload.error)));
    } else {
      pending.resolve(payload.result);
    }
  }

  send(method, params = {}) {
    const id = this.nextId++;
    const payload = JSON.stringify({ id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(payload);
    });
  }

  close() {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.close();
  }
}

async function evaluatePage(client) {
  const expression = `(() => ({
    url: location.href,
    title: document.title,
    readyState: document.readyState,
    text: document.body ? document.body.innerText : '',
    html: document.documentElement ? document.documentElement.outerHTML : ''
  }))()`;
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.result.value;
}

async function capturePage(config) {
  const activePortPath = path.join(config.profileDir, 'DevToolsActivePort');
  rmSync(activePortPath, { force: true });

  const chrome = spawn(
    config.chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--remote-debugging-port=0',
      '--remote-allow-origins=*',
      '--window-size=1365,1000',
      `--user-data-dir=${config.profileDir}`,
      config.url,
    ],
    { stdio: 'ignore' }
  );

  let client;
  try {
    const port = await waitForDevToolsPort(config.profileDir, 10000);
    const target = await waitForPageTarget(port, 10000);
    client = new CdpClient(target.webSocketDebuggerUrl);
    await client.connect();
    await client.send('Page.enable');
    await client.send('Runtime.enable');

    let snapshot = await evaluatePage(client);
    const deadline = Date.now() + config.checkTimeoutMs;
    while (Date.now() < deadline) {
      snapshot = await evaluatePage(client);
      if (snapshot.readyState === 'complete') {
        const text = normalizeText(snapshot.text);
        if (text || normalizeText(snapshot.html).includes('Cloudflare')) break;
      }
      await sleep(1000);
    }

    writeFileSync(config.lastHtmlPath, snapshot.html || '');
    return snapshot;
  } finally {
    client?.close();
    await terminateChrome(chrome);
  }
}

async function terminateChrome(chrome) {
  if (!chrome || chrome.killed) return;
  const exited = new Promise((resolve) => chrome.once('exit', resolve));
  chrome.kill('SIGTERM');
  const timeout = sleep(2500).then(() => 'timeout');
  if ((await Promise.race([exited, timeout])) === 'timeout') {
    chrome.kill('SIGKILL');
    await Promise.race([exited, sleep(1000)]);
  }
}

function analyzeSnapshot(config, snapshot) {
  const text = normalizeText(snapshot.text);
  const html = snapshot.html || '';
  const combined = `${text} ${html}`;
  const blocked = config.cloudflareKeywords.some((keyword) => combined.includes(keyword));

  const products = config.products.map((product, index) => {
    const productIndex = text.indexOf(product.name);
    if (blocked) {
      return { name: product.name, status: 'blocked', reason: 'cloudflare_or_security_challenge' };
    }
    if (productIndex === -1) {
      return { name: product.name, status: 'unknown', reason: 'product_name_not_found' };
    }

    const nextProductIndexes = config.products
      .slice(index + 1)
      .map((nextProduct) => text.indexOf(nextProduct.name))
      .filter((value) => value > productIndex);
    const sectionEnd = nextProductIndexes.length > 0 ? Math.min(...nextProductIndexes) : productIndex + 2000;
    const section = text.slice(productIndex, sectionEnd);
    const outOfStock = config.outOfStockKeywords.some((keyword) => section.includes(keyword));
    if (outOfStock) {
      return { name: product.name, status: 'out_of_stock', reason: 'out_of_stock_keyword_found' };
    }

    const required = product.requiredKeywordsAny || [];
    const hasRequiredEvidence = required.length === 0 || required.some((keyword) => section.includes(keyword));
    if (!hasRequiredEvidence) {
      return { name: product.name, status: 'unknown', reason: 'required_product_evidence_not_found' };
    }

    return { name: product.name, status: 'in_stock', reason: 'product_found_without_out_of_stock_keyword' };
  });

  return {
    checkedAt: nowIso(),
    url: snapshot.url,
    title: snapshot.title,
    pageStatus: blocked ? 'blocked' : 'loaded',
    products,
  };
}

function applyStateAndNotify(config, analysis, mode) {
  const previousState = readJson(config.statePath, { products: {}, cloudflare: {} });
  const state = JSON.parse(JSON.stringify(previousState));
  const notifications = [];
  const now = Date.now();

  for (const product of analysis.products) {
    const previous = state.products[product.name] || {};
    if (product.status === 'in_stock' && previous.lastStatus !== 'in_stock') {
      notifications.push({ type: 'stock', product: product.name });
    }
    state.products[product.name] = {
      ...previous,
      lastStatus: product.status,
      lastReason: product.reason,
      lastCheckedAt: analysis.checkedAt,
      lastInStockAt: product.status === 'in_stock' ? analysis.checkedAt : previous.lastInStockAt,
    };
  }

  if (analysis.pageStatus === 'blocked') {
    const lastNotifiedAt = state.cloudflare.lastNotifiedAt ? Date.parse(state.cloudflare.lastNotifiedAt) : 0;
    if (!lastNotifiedAt || now - lastNotifiedAt > config.cloudflareNotifyCooldownMs) {
      notifications.push({ type: 'blocked' });
      state.cloudflare.lastNotifiedAt = analysis.checkedAt;
    }
  }

  if (mode === 'once') return notifications;

  state.updatedAt = analysis.checkedAt;
  writeJson(config.statePath, state);

  for (const notification of notifications) {
    if (notification.type === 'stock') {
      notify('DMIT 有货提醒', notification.product, `${notification.product} 有货了，点击查看 DMIT 购物车。`);
      openCart(config);
    } else if (notification.type === 'blocked') {
      notify('DMIT 监控需要验证', 'Cloudflare 验证', 'DMIT 页面被安全验证拦截，请重新运行 setup 通过验证。');
    }
  }

  return notifications;
}

async function runMonitor(mode) {
  const config = loadConfig();
  ensureRuntimeDirs(config);

  if (!acquireLock(config)) {
    console.log(JSON.stringify({ checkedAt: nowIso(), status: 'skipped', reason: 'another_check_is_running' }, null, 2));
    return;
  }

  try {
    let analysis;
    try {
      const snapshot = await capturePage(config);
      analysis = analyzeSnapshot(config, snapshot);
    } catch (error) {
      analysis = {
        checkedAt: nowIso(),
        pageStatus: 'error',
        error: error.message,
        products: config.products.map((product) => ({
          name: product.name,
          status: 'unknown',
          reason: 'check_error',
        })),
      };
    }

    writeJson(config.lastResultPath, analysis);
    const notifications = applyStateAndNotify(config, analysis, mode);
    console.log(JSON.stringify({ ...analysis, notifications }, null, 2));
  } finally {
    releaseLock(config);
  }
}

function runSetup() {
  const config = loadConfig();
  ensureRuntimeDirs(config);
  const child = spawn(
    config.chromePath,
    [
      `--user-data-dir=${config.profileDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      config.url,
    ],
    { detached: true, stdio: 'ignore' }
  );
  child.unref();
  console.log(`Opened DMIT setup Chrome profile: ${config.profileDir}`);
  console.log('Complete the Cloudflare verification, then close that Chrome window before enabling scheduled checks.');
}

function runDemoNotification() {
  notify('DMIT 有货提醒', '测试通知', 'LAX.AN5.Pro.TINY 有货了，点击查看 DMIT 购物车。');
  console.log('Sent demo notification.');
}

async function main() {
  const command = process.argv[2] || DEFAULT_COMMAND;
  if (command === 'setup') {
    runSetup();
    return;
  }
  if (command === 'demo-notification') {
    runDemoNotification();
    return;
  }
  if (command === 'once' || command === 'check') {
    await runMonitor(command);
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.error('Usage: check.mjs setup | once | check | demo-notification');
  process.exit(2);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
