$ErrorActionPreference = "Stop"

Write-Host "[1/4] Installing dependencies..."
npm install

Write-Host "[2/4] Type check..."
npm run lint

Write-Host "[3/4] Build application..."
npm run build

Write-Host "[4/4] Packaging Windows EXE (NSIS)..."
npm run package:win

Write-Host "Done. Check release/ folder for installer exe."
