import { useMemo } from 'react';
import { useRuntime } from '../hooks/use-runtime';

function statusClass(status: string): string {
  if (status === 'healthy') return 'badge healthy';
  if (status === 'degraded') return 'badge degraded';
  if (status === 'unhealthy') return 'badge unhealthy';
  return 'badge unknown';
}

function gaugeClass(load: number): string {
  if (load < 45) return 'gauge low';
  if (load < 75) return 'gauge mid';
  return 'gauge high';
}

export function Dashboard() {
  const { t, locale, snapshot, logs, start, stop, restartBridge, refresh, selectLocale, setPerformanceMode } = useRuntime();

  const healthList = snapshot?.services ?? [];
  const performance = snapshot?.performance;

  const groupedHealth = useMemo(() => {
    return healthList.sort((a, b) => a.name.localeCompare(b.name));
  }, [healthList]);

  return (
    <main className="ultra-layout">
      <div className="animated-bg" />
      <header className="hero glass">
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <div className="sub-meta">{snapshot ? `Updated: ${new Date(snapshot.updatedAt).toLocaleString(locale)}` : 'Initializing...'}</div>
        </div>
        <div className="language-switcher glass-soft">
          <label>{t.language}</label>
          <select value={locale} onChange={(event) => selectLocale(event.target.value as 'ko-KR' | 'en-US')}>
            <option value="ko-KR">한국어</option>
            <option value="en-US">English</option>
          </select>
        </div>
      </header>

      <section className="toolbar glass">
        <button className="btn primary" onClick={() => void start()}>{t.startBot}</button>
        <button className="btn danger" onClick={() => void stop()}>{t.stopBot}</button>
        <button className="btn" onClick={() => void restartBridge()}>{t.restartBridge}</button>
        <button className="btn" onClick={() => void refresh()}>{t.refreshStatus}</button>
        <button className="btn accent" onClick={() => void setPerformanceMode('balanced')}>{t.setBalanced}</button>
        <button className="btn accent" onClick={() => void setPerformanceMode('high-performance')}>{t.setHighPerformance}</button>
        <button className="btn accent" onClick={() => void setPerformanceMode('safe')}>{t.setSafe}</button>
      </section>

      <section className="dashboard-grid">
        <article className="panel glass panel-health">
          <h2>{t.serviceHealth}</h2>
          <div className="health-list">
            {groupedHealth.map((service) => (
              <div key={service.name} className="health-item glass-soft">
                <div className="health-head">
                  <strong>{service.name}</strong>
                  <span className={statusClass(service.status)}>{service.status}</span>
                </div>
                <p>{service.details}</p>
                <small>{new Date(service.lastCheckedAt).toLocaleTimeString(locale)}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel glass panel-performance">
          <h2>{t.performance}</h2>
          <div className="perf-cards">
            <div className="perf-card glass-soft">
              <label>CPU</label>
              <div className={gaugeClass(performance?.cpuLoadPercent ?? 0)}>
                <span style={{ width: `${performance?.cpuLoadPercent ?? 0}%` }} />
              </div>
              <strong>{performance?.cpuLoadPercent ?? 0}%</strong>
            </div>
            <div className="perf-card glass-soft">
              <label>Memory</label>
              <strong>{performance ? `${performance.memoryUsedMb} / ${performance.memoryTotalMb} MB` : '-'}</strong>
            </div>
            <div className="perf-card glass-soft">
              <label>Mode</label>
              <strong>{performance?.mode ?? '-'}</strong>
            </div>
            <div className="perf-card glass-soft">
              <label>GPU Preference</label>
              <strong>{performance?.preferredGpu ?? '-'}</strong>
            </div>
          </div>
          {performance?.protectionTriggered && <div className="protection">보호장치가 활성화되어 안전 모드로 전환되었습니다.</div>}
        </article>

        <article className="panel glass panel-logs">
          <h2>{t.liveLogs}</h2>
          <div className="log-stream">
            {logs.map((line, index) => (
              <pre key={`${line}-${index}`}>{line}</pre>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
