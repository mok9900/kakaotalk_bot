# Kakao Agent Manager (Windows Product-Grade Foundation)

카카오톡 PC 자동화 브릿지를 기반으로 동작하는 **프리미엄 데스크톱 AI 에이전트 매니저**의 실전형 기반 코드입니다.

## 핵심 설계 원칙

- **런처/부트스트랩 분리**: 앱 실행 전 환경 점검, 누락 설치, 업데이트, 복구, 무결성 검증.
- **운영 가시성**: 구조화 로그, 실시간 대시보드, 상태/진단 패널.
- **모듈화**: Bridge / Agent / Command / Service / UI 완전 분리.
- **복구 탄력성**: 브릿지 장애 시 재시작, Firebase 장애 시 degraded 모드.
- **다국어 UI**: 한국어/영어 전환 지원.

## 고성능 정책

요청하신 고성능 운용을 반영해 `balanced`, `high-performance`, `safe` 모드를 제공합니다.
다만 하드웨어 보호를 위해 과부하 위험 시 자동으로 안전 모드로 완화됩니다.

> 기본 정책: 사용자 장비 안정성을 최우선으로 하며, 장비 손상 가능성이 있는 극단 설정은 보호장치 하에서만 허용.

## Windows 실행/배포

- 개발 실행: `npm run start`
- 빌드: `npm run build`
- Windows NSIS 패키징: `npm run package:win`
- 산출물: `release/`

## 관리자 권한 처리

Windows에서 런처가 관리자 권한이 필요한 작업(패키지 설치/업데이트)을 감지하면,
권한이 없는 경우 `RunAs` 재실행 흐름으로 자동 승격을 시도합니다.

## Firebase

`services/src/firebase/firebase-service.ts`에 제공된 Firebase 구성을 반영했습니다.
(실서비스에서는 키 관리 정책에 따라 환경 변수/원격 비밀 저장소로 이관 권장)

## 디렉터리 구조

- `launcher/`: 부트스트랩, 권한 승격, OS 패키지 자동화.
- `main/`: Electron 메인/IPC.
- `ui/`: 글래시 애니메이션 대시보드 + 다국어.
- `core/`: 런타임 오케스트레이션, 메시지 파이프라인.
- `bridge/`: 카카오톡 브릿지 인터페이스 구현체.
- `agent/`: OpenClaw 호환 에이전트 계층.
- `commands/`: 명령 정의/레지스트리.
- `services/`: firebase/logging/health/performance/config.
- `shared/`: 계약/타입/이벤트/i18n.
- `storage/`: 로컬 영속화.
