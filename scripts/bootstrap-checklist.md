# Bootstrap Routine Checklist (Production)

1. OS 호환성 및 관리자 권한 확인 (Windows RunAs 승격).
2. 런타임(Node/npm/Git) 버전 점검.
3. OS 패키지 관리자(winget/choco) 자동 설치/업데이트 시도.
4. 앱 데이터 경로(cache/config/logs/diagnostics/runtime) 초기화.
5. `node_modules` 상태 점검 및 install/update/repair 수행.
6. `dist` 빌드 산출물 누락 시 자동 복구 빌드.
7. 타입/무결성 검증 수행 (`npm run lint`).
8. Firebase 초기화 상태 점검.
9. 최종 bootstrap 리포트 `diagnostics/last-bootstrap.json` 저장.
