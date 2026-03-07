import { useRuntime } from '../hooks/use-runtime';

export function Dashboard() {
  const { status, logs, start, stop, restartBridge, refresh } = useRuntime();

  return (
    <main className="layout">
      <header className="header">
        <h1>Kakao Agent Manager</h1>
        <p>Premium desktop AI agent control center</p>
      </header>

      <section className="actions">
        <button onClick={() => void start()}>Start Bot</button>
        <button onClick={() => void stop()}>Stop Bot</button>
        <button onClick={() => void restartBridge()}>Restart Bridge</button>
        <button onClick={() => void refresh()}>Refresh Status</button>
      </section>

      <section className="grid">
        <article className="card">
          <h2>Service Health</h2>
          <ul>
            {status.map((s) => (
              <li key={s.name}>
                <strong>{s.name}</strong> — <span className={`badge ${s.status}`}>{s.status}</span>
                <div>{s.details}</div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Live Logs</h2>
          <div className="logs">
            {logs.map((line, index) => (
              <pre key={`${line}-${index}`}>{line}</pre>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
