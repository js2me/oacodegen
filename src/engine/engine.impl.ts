import { CodegenTemplateImpl } from '../oa-schema/codegen/codegen-template/codegen-template.impl.js';
import { OASchemaCodegenImpl } from '../oa-schema/codegen/oa-schema-codegen.impl.js';
import {
  OASchemaLoaderImpl,
  OASchemaParserImpl,
  OASchemaWalker,
  OASchemaWalkerImpl,
} from '../oa-schema/index.js';
import { Logger, LoggerImpl } from '../utils/index.js';

import { Engine } from './engine.js';
import { EngineConfig, EngineEntityClasses } from './engine.types.js';

export class EngineImpl implements Engine {
  protected logger: Logger;

  researchedSchemas: Map<string, OASchemaWalker>;

  researchedSegments: Map<string, any>;

  entityClasses: Required<EngineEntityClasses> = {
    codegen: OASchemaCodegenImpl,
    codegenTemplate: CodegenTemplateImpl,
    loader: OASchemaLoaderImpl,
    parser: OASchemaParserImpl,
    walker: OASchemaWalkerImpl,
  };

  constructor(public config: EngineConfig) {
    this.logger = new LoggerImpl({
      engine: this,
      name: 'engine',
    });

    this.researchedSchemas = new Map();
    this.researchedSegments = new Map();
  }

  async run() {
    const overrides =
      typeof this.config.overrides === 'function'
        ? await this.config.overrides(this)
        : this.config.overrides;

    Object.assign(this.entityClasses, overrides);

    const loader = new this.entityClasses.loader({ engine: this });

    this.logger.info('start loading swagger schema using your input');

    const schema = await loader.load(this.config.inputSchemaPayload);

    if (!schema || Object.keys(schema).length === 0) {
      throw this.logger.error(
        'loaded open api schema is empty. Something went wrong.',
      );
    }

    this.logger.log('your schema is loaded successfuly!');

    this.logger.info('start parsing your schema into internal data format');

    const parser = new this.entityClasses.parser({ engine: this });

    const internalSchema = await parser.parse({
      schema,
    });

    this.logger.info('start generating using your generate function');

    const codegen = new this.entityClasses.codegen({ engine: this });

    await this.config.generate(
      codegen.createPresetsEngine('#', internalSchema),
    );
  }

  static async run(config: EngineConfig) {
    return await new EngineImpl(config).run();
  }
}
