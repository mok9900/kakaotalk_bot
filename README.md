# Kakao Agent Manager (Windows Desktop Foundation)

Production-minded scaffold for a premium KakaoTalk PC automation manager:

- **Launcher/Bootstrap layer** for environment checks, dependency install/update/repair, and verification.
- **Electron host** with isolated IPC control surface.
- **React dashboard** for runtime control and live logs.
- **Bridge abstraction** for unofficial KakaoTalk desktop automation.
- **OpenClaw-compatible agent service abstraction**.
- **Firebase and health services** with graceful degraded mode support.
- **Modular command registry** with plugin-like command definitions.

## Core lifecycle

1. `launcher/src/index.ts` runs bootstrap checks.
2. Bootstrap verifies runtime, dependencies, and filesystem health.
3. Main Electron process initializes services/runtime.
4. Dashboard starts/stops bot and displays service health/log streams.
5. Message pipeline routes events through command and agent layers.

## Windows packaging

- Build and package with Electron Builder: `npm run package:win`
- Generates NSIS installer in `release/`.

## Directory overview

- `launcher/`: bootstrap and dependency freshness policy.
- `main/`: Electron main + preload IPC bridge.
- `ui/`: React dashboard UI.
- `core/`: runtime orchestration and message pipeline.
- `bridge/`: Kakao bridge interface implementation scaffold.
- `agent/`: OpenClaw-compatible agent scaffold.
- `commands/`: modular command registry and handlers.
- `services/`: firebase, logging, config, health.
- `shared/`: shared contracts and normalized event types.
- `storage/`: local persistence helpers.
