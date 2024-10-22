import { get } from 'lodash-es';
import { OpenAPIV3 } from 'openapi-types';

import { Logger, LoggerImpl } from '../../utils/index.js';

import { OASchemaWalker } from './oa-schema-walker.js';
import { OASchemaWalkerConfig } from './oa-schema-walker.types.js';

export class OASchemaWalkerImpl implements OASchemaWalker {
  protected logger: Logger;

  schema: OpenAPIV3.Document;

  schemaAddress: string;

  constructor(protected config: OASchemaWalkerConfig) {
    this.logger = new LoggerImpl({
      engine: config.engine,
      name: 'oa-schema-walker',
    });

    this.schemaAddress = config.schemaAddress ?? '#';
    this.schema = config.schema;

    if (this.config.engine.researchedSchemas.has(this.schemaAddress)) {
      throw this.logger.error(
        'Something went wrong. This schema already researched.',
      );
    }

    this.config.engine.researchedSchemas.set(this.schemaAddress, this);

    this.logger.debug('initialized');
  }

  async resolveSchema(
    input: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
  ): Promise<OpenAPIV3.SchemaObject | null> {
    let result = input;

    while (result && '$ref' in result) {
      result = await this.getByRef(result.$ref);
    }

    return result ?? null;
  }

  getByRef(ref: string): Promise<any> {
    this.logger.debug('get by ref', ref);

    if (this.config.engine.researchedSegments.has(ref)) {
      this.logger.debug('get by ref', ref, '<cached>');
      return this.config.engine.researchedSegments.get(ref)!;
    }

    // inside schema ref
    if (ref.startsWith('#/')) {
      const path = ref.split('/').slice(1);

      const segment = get(this.schema, path);

      this.logger.debug('get by ref path:', path, 'result:', segment);

      this.config.engine.researchedSegments.set(ref, segment);

      return segment;
    }

    throw this.logger.debug('outer refs is not implemented');
  }
}
