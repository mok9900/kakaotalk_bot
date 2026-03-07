import { useEffect, useState } from 'react';

type ServiceHealth = {
  name: string;
  status: string;
  details?: string;
  lastCheckedAt: string;
};

export function useRuntime() {
  const [status, setStatus] = useState<ServiceHealth[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    void window.botApi.status().then((next) => setStatus(next as ServiceHealth[]));
    window.botApi.onLog((entry) => setLogs((prev) => [JSON.stringify(entry), ...prev].slice(0, 200)));
  }, []);

  const refresh = async () => {
    const next = await window.botApi.status();
    setStatus(next as ServiceHealth[]);
  };

  return {
    status,
    logs,
    start: async () => {
      await window.botApi.start();
      await refresh();
    },
    stop: async () => {
      await window.botApi.stop();
      await refresh();
    },
    restartBridge: async () => {
      await window.botApi.restartBridge();
      await refresh();
    },
    refresh
  };
}
