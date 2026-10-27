import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);

const chromePath = CHROME_PATHS.find((p) => existsSync(p));
if (!chromePath) {
  console.error('Error: Google Chrome executable not found.');
  process.exit(1);
}

const DEBUG_PORT = 9222;
const TARGET_URL = 'http://127.0.0.1:5173/?og=1';
const OUTPUT_PATH = join(process.cwd(), 'public', 'og-image.png');
const tempUserDataDir = join(tmpdir(), `bloom-og-chrome-${Date.now()}`);

mkdirSync(tempUserDataDir, { recursive: true });

console.log(`[OG-Image] Using Chrome at: ${chromePath}`);
console.log(`[OG-Image] Target URL: ${TARGET_URL}`);
console.log(`[OG-Image] Output File: ${OUTPUT_PATH}`);

// 1. Launch Chrome Headless with Remote Debugging
const chromeProcess = spawn(
  chromePath,
  [
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--headless=new',
    `--user-data-dir=${tempUserDataDir}`,
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-extensions',
    '--disable-sync',
    '--disable-default-apps',
    '--mute-audio',
    '--window-size=1200,630',
  ],
  { stdio: 'ignore', detached: false }
);

function cleanup() {
  try {
    chromeProcess.kill('SIGKILL');
  } catch {}
  try {
    rmSync(tempUserDataDir, { recursive: true, force: true });
  } catch {}
}

process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

async function waitForCdpReady(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
      if (res.ok) return await res.json();
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Chrome remote debugging port not available after timeout.');
}

async function run() {
  try {
    console.log('[OG-Image] Waiting for Chrome CDP...');
    await waitForCdpReady();

    // Create a new tab pointing to TARGET_URL
    const newTabRes = await fetch(
      `http://127.0.0.1:${DEBUG_PORT}/json/new?${encodeURIComponent(TARGET_URL)}`,
      { method: 'PUT' }
    );
    const tabInfo = await newTabRes.json();
    const wsUrl = tabInfo.webSocketDebuggerUrl;

    if (!wsUrl) {
      throw new Error('Could not obtain WebSocket debugger URL for new tab.');
    }

    console.log(`[OG-Image] Connected to CDP WebSocket: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    let nextId = 1;
    const pendingPromises = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pendingPromises.has(msg.id)) {
        const { resolve, reject } = pendingPromises.get(msg.id);
        pendingPromises.delete(msg.id);
        if (msg.error) {
          reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        } else {
          resolve(msg.result);
        }
      }
    };

    function sendCommand(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = nextId++;
        pendingPromises.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    console.log('[OG-Image] Configuring 1200x630 @ 2x Retina Viewport...');
    await sendCommand('Page.enable');
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: 1200,
      height: 630,
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log('[OG-Image] Loading page and waiting for fonts & card render...');
    await new Promise((resolve) => setTimeout(resolve, 4000));

    console.log('[OG-Image] Capturing high-resolution screenshot...');
    const screenshotResult = await sendCommand('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    });

    const rawBuffer = Buffer.from(screenshotResult.data, 'base64');
    
    // Optimize for WhatsApp, Facebook, iMessage, Twitter (<300 KB limit)
    console.log('[OG-Image] Optimizing for social media scrapers (WhatsApp/Twitter)...');
    await sharp(rawBuffer)
      .resize(1200, 630)
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(OUTPUT_PATH);

    const metadata = await sharp(OUTPUT_PATH).metadata();
    const stat = (await import('node:fs')).statSync(OUTPUT_PATH);
    console.log(
      `[OG-Image] Verification Success: ${metadata.width}x${metadata.height}px, ${metadata.format.toUpperCase()}, ${(stat.size / 1024).toFixed(1)} KB`
    );

    ws.close();
  } finally {
    cleanup();
  }
}

run()
  .then(() => {
    console.log('[OG-Image] Completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('[OG-Image] Failed:', err);
    cleanup();
    process.exit(1);
  });
