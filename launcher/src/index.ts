import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { BootstrapRunner } from './bootstrap/bootstrap-runner';
import { AdminManager } from './platform/admin';

function launchMain(projectRoot: string): void {
  const distMain = resolve(projectRoot, 'dist/main/main.js');

  if (existsSync(distMain)) {
    spawn('npx', ['electron', distMain], { stdio: 'inherit', cwd: projectRoot, shell: true });
    return;
  }

  spawn('npm', ['run', 'dev:main'], { stdio: 'inherit', cwd: projectRoot, shell: true });
}

async function main() {
  const admin = new AdminManager();

  if (process.platform === 'win32') {
    const launcherScript = resolve(process.argv[1] ?? __filename);
    admin.elevateIfNeeded(launcherScript);
  }

  const projectRoot = resolve(__dirname, '../..');
  const runner = new BootstrapRunner();
  const results = await runner.run(projectRoot);

  const failed = results.find((r) => !r.success);
  if (failed) {
    console.error(`Bootstrap failed at step: ${failed.step} (${failed.message})`);
    process.exit(1);
  }

  launchMain(projectRoot);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
