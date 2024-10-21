import { get } from 'lodash-es';
import { OpenAPIV3 } from 'openapi-types';

import { Logger, LoggerImpl } from '../../utils/index.js';

import { OASchemaWalker } from './oa-schema-walker.js';
import { OASchemaWalkerConfig } from './oa-schema-walker.types.js';

export class OASchemaWalkerImpl implements OASchemaWalker {
  protected logger: Logger;

  protected researchedSchemas: Map<string, OASchemaWalker>;
  protected researchedSegments: Map<string, any>;

  schema: OpenAPIV3.Document;

  constructor(protected config: OASchemaWalkerConfig) {
    this.logger = new LoggerImpl({
      mainConfig: config.mainConfig,
      name: 'oa-schema-walker',
    });

    this.schema = config.schema;
    this.researchedSchemas = new Map();
    this.researchedSegments = new Map();

    this.researchedSchemas.set('#', this);

    this.logger.debug('initialized');
  }

  getByRef(ref: string): Promise<any> {
    this.logger.debug('get by ref', ref);

    if (this.researchedSegments.has(ref)) {
      this.logger.debug('get by ref', ref, '<cached>');
      return this.researchedSegments.get(ref)!;
    }

    // inside schema ref
    if (ref.startsWith('#/')) {
      const path = ref.split('/').slice(1);

      const segment = get(this.schema, path);

      this.logger.debug('get by ref path:', path, 'result:', segment);

      this.researchedSegments.set(ref, segment);

      return segment;
    }

    throw this.logger.debug('outer refs is not implemented');
  }
}
