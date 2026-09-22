const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = process.env.TEST_PORT || '3001';
const API_BASE_URL = `http://127.0.0.1:${PORT}`;
const ROOT = path.join(__dirname, '..', '..');

process.env.API_BASE_URL = API_BASE_URL;

function waitForHealth(timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;

  return new Promise((resolve, reject) => {
    const ping = () => {
      const req = http.get(`${API_BASE_URL}/healthcheck`, (res) => {
        res.resume();
        if (res.statusCode === 200) {
          resolve();
          return;
        }
        retry();
      });
      req.on('error', retry);
    };

    const retry = () => {
      if (Date.now() > deadline) {
        reject(new Error(`API did not become ready at ${API_BASE_URL}`));
        return;
      }
      setTimeout(ping, 150);
    };

    ping();
  });
}

let serverProcess;

exports.mochaHooks = {
  async beforeAll() {
    this.timeout(20000);

    serverProcess = spawn(process.execPath, [path.join(ROOT, 'src', 'index.js')], {
      cwd: ROOT,
      env: { ...process.env, PORT },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    serverProcess.stderr.on('data', (chunk) => {
      process.stderr.write(chunk);
    });

    serverProcess.on('exit', (code, signal) => {
      if (code && code !== 0) {
        console.error(`API process exited with code ${code} signal ${signal}`);
      }
    });

    await waitForHealth();
  },

  async afterAll() {
    if (!serverProcess || serverProcess.killed) {
      return;
    }

    await new Promise((resolve) => {
      serverProcess.once('exit', resolve);
      serverProcess.kill();
      setTimeout(() => {
        if (!serverProcess.killed) {
          serverProcess.kill('SIGKILL');
        }
        resolve();
      }, 2000);
    });
  }
};
