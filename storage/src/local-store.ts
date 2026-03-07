import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export class LocalStore<T extends Record<string, unknown>> {
  constructor(private readonly filePath: string) {}

  async load(defaultValue: T): Promise<T> {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }

  async save(value: T): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, JSON.stringify(value, null, 2), 'utf8');
  }
}
