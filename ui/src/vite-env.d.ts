/// <reference types="vite/client" />

declare global {
  interface Window {
    botApi: {
      start: () => Promise<unknown>;
      stop: () => Promise<unknown>;
      status: () => Promise<unknown>;
      restartBridge: () => Promise<unknown>;
      onLog: (cb: (entry: unknown) => void) => void;
    };
  }
}

export {};
