import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('botApi', {
  start: () => ipcRenderer.invoke('runtime:start'),
  stop: () => ipcRenderer.invoke('runtime:stop'),
  status: () => ipcRenderer.invoke('runtime:status'),
  restartBridge: () => ipcRenderer.invoke('runtime:restart-bridge'),
  onLog: (cb: (entry: unknown) => void) => ipcRenderer.on('log:entry', (_event, payload) => cb(payload))
});
