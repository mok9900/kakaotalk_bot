# Kakao Agent Manager (Windows Product-Grade Foundation)

카카오톡 PC 자동화 브릿지를 기반으로 동작하는 **프리미엄 데스크톱 AI 에이전트 매니저**입니다.

## 핵심 포인트

- **EXE 배포 중심**: Electron Builder(NSIS)로 Windows 설치형 EXE 생성.
- **런처/부트스트랩 분리**: 실행 전 누락 설치·업데이트·복구·검증 수행.
- **관리자 권한 자동 승격**: 설치/업데이트 필요 시 RunAs 재실행.
- **다국어 UI**: 한국어/영어 전환.
- **설정 패널 모드 제어**: balanced / high-performance / safe.
- **기본 Firebase 사용**: 1인 운영 기준으로 앱 내 기본 구성 활성화.

## 실행 및 빌드

- 개발 실행: `npm run start`
- 타입 검증: `npm run lint`
- 빌드: `npm run build`
- Windows EXE 패키징: `npm run package:win`
- Windows 원클릭 빌드+패키징 스크립트: `npm run build:exe:win`

> 최종 설치 파일은 `release/` 폴더에서 확인할 수 있습니다.

## 부트스트랩 동작

1. 관리자 권한 확인(Windows)
2. 런타임(Node/npm/Git) 검사
3. winget/choco 기반 자동 설치/업데이트 시도
4. 앱 데이터 경로 초기화
5. node_modules install/update/repair
6. dist 누락 시 빌드 복구
7. 무결성 검사
8. bootstrap 리포트 저장

## UI 설계 방향

- 글래시스(Glassmorphism) + 오로라 백그라운드
- 슬라이드 인 애니메이션
- 사이드 네비게이션 + 운영 카드 레이아웃
- 성능 게이지 / 실시간 로그 / 설정 패널

## 디렉터리 개요

- `launcher/`: 부트스트랩, 권한 승격, OS 패키지 자동화
- `main/`: Electron 메인/IPC
- `ui/`: 프리미엄 대시보드
- `core/`: 런타임 오케스트레이션
- `bridge/`: 카카오톡 브릿지 계층
- `agent/`: OpenClaw 호환 계층
- `commands/`: 명령 레지스트리
- `services/`: firebase/logging/health/performance/config
- `shared/`: 타입/계약/i18n
- `storage/`: 로컬 저장
