import { useMemo, useState } from 'react';
import { useRuntime } from '../hooks/use-runtime';

function statusClass(status: string): string {
  if (status === 'healthy') return 'status healthy';
  if (status === 'degraded') return 'status degraded';
  if (status === 'unhealthy') return 'status unhealthy';
  return 'status unknown';
}

function perfBarClass(value: number): string {
  if (value >= 80) return 'perf-bar high';
  if (value >= 50) return 'perf-bar mid';
  return 'perf-bar low';
}

export function Dashboard() {
  const { t, locale, snapshot, logs, start, stop, restartBridge, refresh, selectLocale, setPerformanceMode } = useRuntime();
  const [activeMenu, setActiveMenu] = useState<'overview' | 'rooms' | 'commands' | 'logs' | 'settings' | 'diagnostics'>('overview');

  const services = snapshot?.services ?? [];
  const performance = snapshot?.performance;

  const sortedServices = useMemo(() => [...services].sort((a, b) => a.name.localeCompare(b.name)), [services]);

  return (
    <main className="app-shell">
      <div className="app-backdrop" />
      <aside className="sidebar glass slide-in-left">
        <div className="brand-block">
          <div className="logo-orb" />
          <div>
            <h1>{t.title}</h1>
            <p>Desktop Control Plane</p>
          </div>
        </div>

        <nav className="menu-list">
          {[
            ['overview', 'Overview'],
            ['rooms', 'Rooms'],
            ['commands', 'Commands'],
            ['logs', 'Logs'],
            ['settings', 'Settings'],
            ['diagnostics', 'Diagnostics']
          ].map(([id, label]) => (
            <button key={id} className={`menu-item ${activeMenu === id ? 'active' : ''}`} onClick={() => setActiveMenu(id as typeof activeMenu)}>
              <span className="dot" />
              {label}
            </button>
          ))}
        </nav>

        <div className="locale-panel glass-soft">
          <label>{t.language}</label>
          <select value={locale} onChange={(event) => selectLocale(event.target.value as 'ko-KR' | 'en-US')}>
            <option value="ko-KR">한국어</option>
            <option value="en-US">English</option>
          </select>
        </div>
      </aside>

      <section className="main-area slide-in-up">
        <header className="topbar glass">
          <div>
            <h2>{t.subtitle}</h2>
            <small>{snapshot ? new Date(snapshot.updatedAt).toLocaleString(locale) : 'loading...'}</small>
          </div>
          <div className="top-actions">
            <button className="btn primary" onClick={() => void start()}>{t.startBot}</button>
            <button className="btn danger" onClick={() => void stop()}>{t.stopBot}</button>
            <button className="btn" onClick={() => void restartBridge()}>{t.restartBridge}</button>
            <button className="btn" onClick={() => void refresh()}>{t.refreshStatus}</button>
          </div>
        </header>

        <div className="content-grid">
          <article className="panel glass card-span-2">
            <div className="panel-head">
              <h3>{t.serviceHealth}</h3>
              <span className="chip">LIVE</span>
            </div>
            <div className="service-grid">
              {sortedServices.map((service) => (
                <div key={service.name} className="service-card glass-soft">
                  <div className="service-header">
                    <strong>{service.name}</strong>
                    <span className={statusClass(service.status)}>{service.status}</span>
                  </div>
                  <p>{service.details}</p>
                  <small>{new Date(service.lastCheckedAt).toLocaleTimeString(locale)}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="panel glass">
            <div className="panel-head">
              <h3>{t.performance}</h3>
              <span className="chip">MODE</span>
            </div>

            <div className="perf-box glass-soft">
              <label>CPU</label>
              <div className={perfBarClass(performance?.cpuLoadPercent ?? 0)}>
                <span style={{ width: `${performance?.cpuLoadPercent ?? 0}%` }} />
              </div>
              <strong>{performance?.cpuLoadPercent ?? 0}%</strong>
            </div>

            <div className="perf-box glass-soft">
              <label>Memory</label>
              <strong>{performance ? `${performance.memoryUsedMb} / ${performance.memoryTotalMb} MB` : '-'}</strong>
            </div>

            <div className="perf-box glass-soft">
              <label>GPU Preference</label>
              <strong>{performance?.preferredGpu ?? '-'}</strong>
            </div>

            <div className="perf-box glass-soft">
              <label>Mode</label>
              <strong>{performance?.mode ?? '-'}</strong>
              {performance?.protectionTriggered && <small className="warning">Protection active → switched to safe</small>}
            </div>
          </article>

          <article className="panel glass card-span-2 slide-in-right">
            <div className="panel-head">
              <h3>{t.liveLogs}</h3>
              <span className="chip">STREAM</span>
            </div>
            <div className="log-viewer">
              {logs.map((line, index) => (
                <pre key={`${line}-${index}`}>{line}</pre>
              ))}
            </div>
          </article>

          <article className="panel glass settings-panel">
            <div className="panel-head">
              <h3>Settings</h3>
              <span className="chip">CONFIG</span>
            </div>

            <div className="setting-row glass-soft">
              <label>{t.modeBalanced}</label>
              <button className="btn accent" onClick={() => void setPerformanceMode('balanced')}>{t.setBalanced}</button>
            </div>
            <div className="setting-row glass-soft">
              <label>{t.modeHighPerformance}</label>
              <button className="btn accent" onClick={() => void setPerformanceMode('high-performance')}>{t.setHighPerformance}</button>
            </div>
            <div className="setting-row glass-soft">
              <label>{t.modeSafe}</label>
              <button className="btn accent" onClick={() => void setPerformanceMode('safe')}>{t.setSafe}</button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
