import fs from 'node:fs';

import { LoggerImpl } from '../logger/logger.impl.js';
import { Logger } from '../logger/logger.js';

import { FileSystem } from './file-system.js';
import { FileSystemConfig } from './file-system.types.js';

export class FileSystemImpl implements FileSystem {
  protected logger: Logger;

  constructor(protected config: FileSystemConfig) {
    this.logger = new LoggerImpl({
      mainConfig: config.mainConfig,
      name: 'file-system',
    });
    this.logger.debug('initialized');
  }

  isExist(path: string): boolean {
    this.logger.debug('isExist', path);
    const result = fs.existsSync(path);
    this.logger.debug('isExist result', result);
    return result;
  }

  isDir(path: string): boolean {
    this.logger.debug('isDir', path);
    const result = this.isExist(path) && fs.statSync(path).isDirectory();
    this.logger.debug('isDir result', result);
    return result;
  }

  isFile(path: string): boolean {
    this.logger.debug('isFile', path);
    const result = this.isExist(path) && !fs.statSync(path).isDirectory();
    this.logger.debug('isFile result', result);
    return result;
  }

  writeFile(path: string, content: string): void {
    this.logger.debug('writeFile', path);
    fs.writeFileSync(path, content);
    this.logger.debug('writeFile OK');
  }

  readFile(path: string): string {
    this.logger.debug('readFile', path);
    const buffer = fs.readFileSync(path);
    this.logger.debug('readFile OK', buffer);
    return buffer.toString();
  }
}
