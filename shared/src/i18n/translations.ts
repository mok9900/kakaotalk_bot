export type Locale = 'ko-KR' | 'en-US';

export const translations: Record<Locale, Record<string, string>> = {
  'ko-KR': {
    title: '카카오 에이전트 매니저',
    subtitle: '프리미엄 데스크톱 AI 오퍼레이션 센터',
    startBot: '봇 시작',
    stopBot: '봇 중지',
    restartBridge: '브릿지 재시작',
    refreshStatus: '상태 새로고침',
    serviceHealth: '서비스 상태',
    liveLogs: '실시간 로그',
    performance: '성능',
    diagnostics: '진단',
    language: '언어',
    modeBalanced: '균형',
    modeHighPerformance: '고성능',
    modeSafe: '안전',
    setBalanced: '균형 모드',
    setHighPerformance: '고성능 모드',
    setSafe: '안전 모드'
  },
  'en-US': {
    title: 'Kakao Agent Manager',
    subtitle: 'Premium Desktop AI Operations Center',
    startBot: 'Start Bot',
    stopBot: 'Stop Bot',
    restartBridge: 'Restart Bridge',
    refreshStatus: 'Refresh Status',
    serviceHealth: 'Service Health',
    liveLogs: 'Live Logs',
    performance: 'Performance',
    diagnostics: 'Diagnostics',
    language: 'Language',
    modeBalanced: 'Balanced',
    modeHighPerformance: 'High Performance',
    modeSafe: 'Safe',
    setBalanced: 'Set Balanced',
    setHighPerformance: 'Set High Performance',
    setSafe: 'Set Safe'
  }
};
