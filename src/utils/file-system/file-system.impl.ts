import { noop } from 'lodash-es';

import fs from 'node:fs';

import { LoggerImpl } from '../logger/logger.impl.js';
import { Logger } from '../logger/logger.js';

import { FileSystem } from './file-system.js';
import { FileSystemConfig } from './file-system.types.js';

export class FileSystemImpl implements FileSystem {
  protected logger: Logger;

  constructor(protected config: FileSystemConfig) {
    this.logger = new LoggerImpl({
      engine: config.engine,
      name: 'file-system',
    });
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

  deleteDir(path: string) {
    this.logger.debug('clearDir', path);

    if (this.isExist(path) && this.isDir(path)) {
      fs.rm(path, { recursive: true }, noop);
    }

    this.logger.debug('clearDir OK');
  }

  deleteFile(path: string) {
    this.logger.debug('deleteFile', path);

    if (this.isExist(path) && this.isFile(path)) {
      fs.rm(path, { recursive: true }, noop);
    }

    this.logger.debug('deleteFile OK');
  }

  writeFile(path: string, content: string): void {
    this.logger.debug('writeFile', path);

    const directorySegments = path.split('/').slice(0, -1);
    const directory = directorySegments.join('/');

    if (!this.isExist(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

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
