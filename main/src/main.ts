import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'node:path';
import { BotRuntime } from '@core/lifecycle/bot-runtime';

const runtime = new BotRuntime();

async function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: '#0b1020',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const rendererPath = join(__dirname, '../ui/index.html');
  await win.loadFile(rendererPath);
}

app.whenReady().then(async () => {
  await runtime.initialize();
  await createWindow();

  runtime.onLog((entry) => {
    BrowserWindow.getAllWindows().forEach((window) => {
      window.webContents.send('log:entry', entry);
    });
  });
});

ipcMain.handle('runtime:start', async () => {
  await runtime.start();
  return runtime.status();
});

ipcMain.handle('runtime:stop', async () => {
  await runtime.stop();
  return runtime.status();
});

ipcMain.handle('runtime:status', async () => runtime.status());
ipcMain.handle('runtime:restart-bridge', async () => {
  await runtime.restartBridge();
  return runtime.status();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
