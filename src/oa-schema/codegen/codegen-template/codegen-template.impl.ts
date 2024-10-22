import {
  FileSystem,
  FileSystemImpl,
  Logger,
  LoggerImpl,
} from '../../../utils/index.js';

import { CodegenTemplate } from './codegen-template.js';
import {
  CodegenTemplateConfig,
  CodegenTemplateSaveParams,
} from './codegen-template.types.js';

export class CodegenTemplateImpl implements CodegenTemplate {
  logger: Logger;
  fs: FileSystem;

  content: string;

  constructor(protected config: CodegenTemplateConfig) {
    this.logger = new LoggerImpl({
      engine: config.engine,
      name: 'codegen-template',
    });

    this.fs = new FileSystemImpl({
      engine: this.config.engine,
    });

    this.content = this.config.content ?? '';

    this.logger.debug('initialized');
  }

  async save(params: CodegenTemplateSaveParams): Promise<void> {
    this.fs.writeFile(params.path, this.content);
  }
}
