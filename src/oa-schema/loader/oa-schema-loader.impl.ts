import jsYaml from 'js-yaml';
import { typeGuard } from 'yammies/type-guard';
import { AnyObject, Maybe } from 'yammies/utils/types';

import { FileSystemImpl } from '../../utils/file-system/file-system.impl.js';
import { FileSystem } from '../../utils/file-system/file-system.js';
import { LoggerImpl } from '../../utils/logger/logger.impl.js';
import { Logger } from '../../utils/logger/logger.js';

import { OASchemaLoader } from './oa-schema-loader.js';
import {
  OASchemaLoaderConfig,
  OASchemaLoaderLoadPayload,
} from './oa-schema-loader.types.js';

export class OASchemaLoaderImpl implements OASchemaLoader {
  protected logger: Logger;
  protected fs: FileSystem;

  constructor(protected config: OASchemaLoaderConfig) {
    this.logger = new LoggerImpl({
      engine: config.engine,
      name: 'oas-schema-loader',
    });
    this.fs = new FileSystemImpl({
      engine: config.engine,
    });
  }

  protected async tryToReadFile(path: string) {
    this.logger.debug('try to read file');
    return this.fs.readFile(path);
  }

  protected async tryToDownloadFile(
    url: string,
    options?: Partial<RequestInit>,
  ) {
    this.logger.debug('try to download file');
    const response = await fetch(url, options);
    return await response.text();
  }

  /**
   * Returns JSON Schema JavaScript Object
   */
  async load(payload: OASchemaLoaderLoadPayload) {
    this.logger.debug('start loading oa schema', payload);

    if (!payload.input) {
      throw this.logger.error('input is not specified');
    }

    let jsonSchema: Maybe<AnyObject> = null;

    if (typeGuard.isString(payload.input)) {
      let content: Maybe<string> = null;

      if (this.fs.isFile(payload.input)) {
        content = await this.tryToReadFile(payload.input);
      } else {
        try {
          content = await this.tryToDownloadFile(
            payload.input,
            payload.requestOptions,
          );
        } catch (error) {
          this.logger.debug('failed to load file by url', payload.input, error);
          content = payload.input;
        }
      }

      try {
        jsonSchema = JSON.parse(content);
      } catch (error) {
        this.logger.debug('failed to json parse content', payload.input, error);
        jsonSchema = jsYaml.load(content) as Maybe<AnyObject>;
      }
    } else {
      jsonSchema = payload.input;
    }

    return jsonSchema;
  }
}
