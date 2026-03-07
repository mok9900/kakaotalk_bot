# Bootstrap Routine Checklist

1. Validate OS + runtime versions.
2. Verify app folders (cache/config/logs/diagnostics).
3. Verify package lock integrity and modules.
4. Install/update/repair dependencies.
5. Run integrity verification (`npm run lint` + smoke checks).
6. Load Firebase config and validate required fields.
7. Emit bootstrap health report for dashboard diagnostics.
