import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { RuntimeDetector } from '../dependency/runtime-detector';
import { PackageInspector } from '../dependency/package-inspector';
import { Installer } from '../dependency/installer';
import { Verifier } from '../dependency/verifier';
import type { BootstrapStepResult } from '@shared/types/system';
import { Logger } from '@services/logging/logger';
import { getAppPaths } from '@services/config/paths';

export class BootstrapRunner {
  private readonly runtimeDetector = new RuntimeDetector();
  private readonly packageInspector = new PackageInspector();
  private readonly installer = new Installer();
  private readonly verifier = new Verifier();

  async run(root: string): Promise<BootstrapStepResult[]> {
    const paths = getAppPaths();
    const logger = new Logger(paths.logsDir);
    await logger.init();

    const results: BootstrapStepResult[] = [];

    results.push(await this.measure('initialize_directories', async () => {
      await Promise.all([
        mkdir(paths.appDataDir, { recursive: true }),
        mkdir(paths.cacheDir, { recursive: true }),
        mkdir(paths.configDir, { recursive: true }),
        mkdir(paths.diagnosticsDir, { recursive: true }),
        mkdir(paths.logsDir, { recursive: true })
      ]);
      await logger.info('bootstrap', 'directories.ready', 'Application directories initialized', paths as unknown as Record<string, unknown>);
      return 'Directories ready';
    }));

    const nodeStatus = this.runtimeDetector.detectNode('22.0.0');
    results.push(await this.measure('check_runtime', async () => {
      if (nodeStatus.status === 'missing') {
        throw new Error('Node.js missing; bootstrap requires Node 22+');
      }
      if (nodeStatus.status === 'outdated') {
        await logger.warn('bootstrap', 'runtime.outdated', 'Node major version differs from required baseline', { installedVersion: nodeStatus.installedVersion });
      }
      return `Node detected: ${nodeStatus.installedVersion ?? 'unknown'}`;
    }));

    const packageState = await this.packageInspector.inspectNodeModules(root);
    results.push(await this.measure('check_dependencies', async () => {
      if (packageState.status === 'missing') {
        this.installer.installDependencies(root);
      }
      if (packageState.status === 'outdated') {
        this.installer.updateDependencies(root);
      }
      if (packageState.status === 'corrupt') {
        this.installer.repairDependencies(root);
      }
      return `Dependencies status: ${packageState.status}`;
    }));

    results.push(await this.measure('verify_health', async () => {
      const ok = this.verifier.verify(root);
      if (!ok) {
        throw new Error('Verification failed; run diagnostics in safe mode');
      }
      return 'Verification completed';
    }));

    const reportPath = join(paths.diagnosticsDir, 'last-bootstrap.json');
    await logger.info('bootstrap', 'run.complete', 'Bootstrap finished', { reportPath, results });

    return results;
  }

  private async measure(step: string, fn: () => Promise<string>): Promise<BootstrapStepResult> {
    const start = Date.now();
    try {
      const message = await fn();
      return { step, success: true, durationMs: Date.now() - start, message };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { step, success: false, durationMs: Date.now() - start, message };
    }
  }
}
