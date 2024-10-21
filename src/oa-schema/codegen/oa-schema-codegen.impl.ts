import { LoggerImpl } from '../../utils/logger/logger.impl.js';
import { Logger } from '../../utils/logger/logger.js';

import { OASchemaCodegen } from './oa-schema-codegen.js';
import {
  OASchemaCodegenConfig,
  OASchemaCodegenGenerateParams,
} from './oa-schema-codegen.types.js';

export class OASchemaCodegenImpl implements OASchemaCodegen {
  protected logger: Logger;

  constructor(protected config: OASchemaCodegenConfig) {
    this.logger = new LoggerImpl({
      name: 'oas-schema-codegen',
      mainConfig: config.mainConfig,
    });

    this.logger.debug('initialized');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  generate(params: OASchemaCodegenGenerateParams): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
