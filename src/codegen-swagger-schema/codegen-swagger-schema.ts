import { OASchemaCodegenImpl } from '../oa-schema/codegen/oa-schema-codegen.impl.js';
import { OASchemaLoaderImpl, OASchemaParserImpl } from '../oa-schema/index.js';
import { Logger, LoggerImpl } from '../utils/index.js';

import { CodegenSwaggerSchemaConfig } from './codegen-swagger-schema.types.js';

export class CodegenSwaggerSchema {
  protected logger: Logger;

  constructor(public mainConfig: CodegenSwaggerSchemaConfig) {
    this.logger = new LoggerImpl({
      mainConfig,
      name: 'codegen-swagger-schema',
    });
    this.logger.debug('initialized');
  }

  static async run(mainConfig: CodegenSwaggerSchemaConfig) {
    return await new CodegenSwaggerSchema(mainConfig).run();
  }

  async run() {
    const oaSchemaLoader =
      this.mainConfig.overrides?.loader ?? new OASchemaLoaderImpl(this);

    this.logger.info('start loading swagger schema using your input');

    const schema = await oaSchemaLoader.load(
      this.mainConfig.inputSchemaPayload,
    );

    if (!schema || Object.keys(schema).length === 0) {
      throw this.logger.error(
        'loaded open api schema is empty. Something went wrong.',
      );
    }

    this.logger.log('your schema is loaded successfuly!');

    this.logger.info('start parsing your schema into internal data format');

    const oaSchemaParser =
      this.mainConfig.overrides?.parser ?? new OASchemaParserImpl(this);

    const internalSchema = await oaSchemaParser.parse({
      schema,
    });

    const schemas = await internalSchema.getSchemas();

    this.logger.log(schemas[0].readableName);

    this.logger.info('start generating ', schemas);

    const oaSchemaCodegen =
      this.mainConfig.overrides?.codegen ?? new OASchemaCodegenImpl(this);

    await oaSchemaCodegen.generate(this.mainConfig.generateParams);
  }
}
