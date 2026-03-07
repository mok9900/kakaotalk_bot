import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { RuntimeDetector } from '../dependency/runtime-detector';
import { PackageInspector } from '../dependency/package-inspector';
import { Installer } from '../dependency/installer';
import { Verifier } from '../dependency/verifier';
import { OsPackageAutomation } from '../platform/package-managers';
import type { BootstrapStepResult } from '@shared/types/system';
import { Logger } from '@services/logging/logger';
import { getAppPaths } from '@services/config/paths';

export class BootstrapRunner {
  private readonly runtimeDetector = new RuntimeDetector();
  private readonly packageInspector = new PackageInspector();
  private readonly installer = new Installer();
  private readonly verifier = new Verifier();
  private readonly osPackageAutomation = new OsPackageAutomation();

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
        mkdir(paths.logsDir, { recursive: true }),
        mkdir(paths.runtimeDir, { recursive: true })
      ]);
      await logger.info('bootstrap', 'directories.ready', '애플리케이션 디렉터리 초기화 완료', paths as unknown as Record<string, unknown>);
      return '디렉터리 준비 완료';
    }));

    const runtimeDeps = this.runtimeDetector.detectAll();
    results.push(await this.measure('check_runtime_dependencies', async () => {
      for (const dep of runtimeDeps) {
        if (dep.status !== 'valid') {
          this.osPackageAutomation.ensure(dep);
        }
      }

      const unresolved = runtimeDeps.filter((d) => d.required && d.status === 'missing');
      if (unresolved.length > 0) {
        throw new Error(`필수 런타임 누락: ${unresolved.map((x) => x.name).join(', ')}`);
      }

      await logger.info('bootstrap', 'runtime.checked', '런타임 점검 완료', {
        runtimeDeps
      });
      return '런타임 검사 완료';
    }));

    const packageState = await this.packageInspector.inspectNodeModules(root);
    results.push(await this.measure('check_node_dependencies', async () => {
      if (packageState.status === 'missing') {
        this.installer.installDependencies(root);
      } else if (packageState.status === 'outdated') {
        this.installer.updateDependencies(root);
      } else if (packageState.status === 'corrupt') {
        this.installer.repairDependencies(root);
      }

      return `노드 의존성 상태: ${packageState.status}`;
    }));

    const buildState = await this.packageInspector.inspectBuildArtifacts(root);
    results.push(await this.measure('check_build_assets', async () => {
      if (buildState.status !== 'valid') {
        this.installer.restoreBuildArtifacts(root);
      }
      return `빌드 산출물 상태: ${buildState.status}`;
    }));

    results.push(await this.measure('verify_health', async () => {
      const ok = this.verifier.verify(root);
      if (!ok) {
        throw new Error('무결성 검증 실패: 안전 모드/복구 모드 실행 필요');
      }
      return '무결성 검증 완료';
    }));

    const reportPath = join(paths.diagnosticsDir, 'last-bootstrap.json');
    await writeFile(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2), 'utf8');
    await logger.info('bootstrap', 'run.complete', '부트스트랩 완료', { reportPath, results });

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
