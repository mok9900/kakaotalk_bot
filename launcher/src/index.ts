import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { BootstrapRunner } from './bootstrap/bootstrap-runner';

async function main() {
  if (process.platform !== 'win32') {
    console.warn('This product targets Windows; continuing in development mode.');
  }

  const projectRoot = resolve(__dirname, '../..');
  const runner = new BootstrapRunner();
  const results = await runner.run(projectRoot);

  const failed = results.find((r) => !r.success);
  if (failed) {
    console.error(`Bootstrap failed at step: ${failed.step} (${failed.message})`);
    process.exit(1);
  }

  spawn('npm', ['run', 'dev:main'], { stdio: 'inherit', cwd: projectRoot, shell: true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
