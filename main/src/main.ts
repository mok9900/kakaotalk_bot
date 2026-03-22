import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'node:path';
import { BotRuntime } from '@core/lifecycle/bot-runtime';
import type { PerformanceMode } from '@shared/types/system';

const runtime = new BotRuntime();

async function createWindow() {
  const win = new BrowserWindow({
    width: 1700,
    height: 1000,
    minWidth: 1360,
    minHeight: 820,
    backgroundColor: '#040812',
    vibrancy: process.platform === 'darwin' ? 'under-window' : undefined,
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
  return runtime.dashboardSnapshot();
});

ipcMain.handle('runtime:stop', async () => {
  await runtime.stop();
  return runtime.dashboardSnapshot();
});

ipcMain.handle('runtime:snapshot', async () => runtime.dashboardSnapshot());
ipcMain.handle('runtime:restart-bridge', async () => {
  await runtime.restartBridge();
  return runtime.dashboardSnapshot();
});
ipcMain.handle('runtime:set-performance-mode', async (_event, mode: PerformanceMode) => {
  await runtime.setPerformanceMode(mode);
  return runtime.dashboardSnapshot();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
