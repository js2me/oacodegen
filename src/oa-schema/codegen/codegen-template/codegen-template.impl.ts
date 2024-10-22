import { format } from 'prettier';
import { typeGuard } from 'yammies/type-guard';

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

export class CodegenTemplateImpl extends String implements CodegenTemplate {
  logger: Logger;
  fs: FileSystem;

  content: string;

  constructor(protected config: CodegenTemplateConfig) {
    super();
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

  valueOf() {
    return this.content;
  }

  toString(): string {
    return this.content;
  }

  async save(params: CodegenTemplateSaveParams): Promise<void> {
    let templateContent = this.content;

    if (this.config.engine.config.formatParams?.usePrettier) {
      templateContent = await format(
        templateContent,
        typeGuard.isBoolean(this.config.engine.config.formatParams?.usePrettier)
          ? {
              tabWidth: 2,
              printWidth: 80,
            }
          : this.config.engine.config.formatParams.usePrettier,
      );
    }

    this.fs.writeFile(params.path, templateContent);
  }
}
