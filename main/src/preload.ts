import { contextBridge, ipcRenderer } from 'electron';
import type { PerformanceMode } from '@shared/types/system';

contextBridge.exposeInMainWorld('botApi', {
  start: () => ipcRenderer.invoke('runtime:start'),
  stop: () => ipcRenderer.invoke('runtime:stop'),
  snapshot: () => ipcRenderer.invoke('runtime:snapshot'),
  restartBridge: () => ipcRenderer.invoke('runtime:restart-bridge'),
  setPerformanceMode: (mode: PerformanceMode) => ipcRenderer.invoke('runtime:set-performance-mode', mode),
  onLog: (cb: (entry: unknown) => void) => ipcRenderer.on('log:entry', (_event, payload) => cb(payload))
});
