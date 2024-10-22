import { LoggerImpl } from '../../utils/logger/logger.impl.js';
import { Logger } from '../../utils/logger/logger.js';

import { OASchemaCodegen } from './oa-schema-codegen.js';
import { OASchemaCodegenConfig } from './oa-schema-codegen.types.js';

export class OASchemaCodegenImpl implements OASchemaCodegen {
  protected logger: Logger;

  constructor(protected config: OASchemaCodegenConfig) {
    this.logger = new LoggerImpl({
      name: 'oas-schema-codegen',
      engine: config.engine,
    });

    this.logger.debug('initialized');
  }

  template(strings: TemplateStringsArray, ...args: any[]) {
    const content = strings
      .map((string_, index) => {
        return `${string_}${args[index] ?? ''}`;
      })
      .join('');

    return new this.config.engine.entityClasses.codegenTemplate({
      engine: this.config.engine,
      content,
    });
  }
}
