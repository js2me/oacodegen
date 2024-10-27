import { typeGuard } from 'yammies/type-guard';

import { OAInternalSchema } from '../../oa-internal-schema/oa-internal-schema.js';
import { FileSystemImpl } from '../../utils/index.js';
import { LoggerImpl } from '../../utils/logger/logger.impl.js';
import { Logger } from '../../utils/logger/logger.js';

import { OASchemaCodegen } from './oa-schema-codegen.js';
import {
  GeneratePresetsEngine,
  OASchemaCodegenConfig,
} from './oa-schema-codegen.types.js';

export class OASchemaCodegenImpl implements OASchemaCodegen {
  protected logger: Logger;

  constructor(protected config: OASchemaCodegenConfig) {
    this.logger = new LoggerImpl({
      name: 'oas-schema-codegen',
      engine: config.engine,
    });
  }

  async template(templateStrings: TemplateStringsArray, ...args: any[]) {
    const contentSegments = await Promise.all(
      templateStrings.map(async (templateString, index) => {
        let stringInsertion = args[index];

        if (typeGuard.isArray(stringInsertion)) {
          stringInsertion = (
            await Promise.all(
              stringInsertion.map(async (it) => {
                if (it instanceof Promise) return await it;
                return it;
              }),
            )
          ).join('');
        }

        if (stringInsertion instanceof Promise) {
          stringInsertion = await stringInsertion;
        }

        return `${templateString}${(stringInsertion ?? '').toString().trim()}`;
      }),
    );

    const content = contentSegments.join('').trim();

    return new this.config.engine.entityClasses.codegenTemplate({
      engine: this.config.engine,
      content,
    });
  }

  createPresetsEngine(
    name: string,
    internalSchema: OAInternalSchema,
  ): GeneratePresetsEngine {
    return {
      fs: new FileSystemImpl({ engine: this.config.engine }),
      logger: new LoggerImpl({
        engine: this.config.engine,
        name,
      }),
      exec: (preset, input, ...args) => {
        return preset(
          input,
          this.createPresetsEngine(preset.name, internalSchema),
          ...args,
        );
      },
      template: (...args) => this.template(...args),
      schema: internalSchema,
      engine: this.config.engine,
    };
  }
}
