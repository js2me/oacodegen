import { OASchemaWalker } from '../oa-schema/walker/index.js';
import { Logger, LoggerImpl } from '../utils/index.js';

import { OAInternalSchema } from './oa-internal-schema.js';
import { OAInternalSchemaConfig } from './oa-internal-schema.types.js';
import { SchemaSegment } from './segments/schema.js';

export class OAInternalSchemaImpl implements OAInternalSchema {
  protected logger: Logger;

  walker: OASchemaWalker;

  constructor(protected config: OAInternalSchemaConfig) {
    this.logger = new LoggerImpl({
      engine: this.config.engine,
      name: 'oa-internal-schema',
    });
    this.walker = new this.config.engine.entityClasses.walker({
      engine: this.config.engine,
      schema: this.config.schema,
      schemaAddress: this.config.schemaAddress,
    });

    this.logger.debug('initialized');
  }

  async getSchemas() {
    const schemas: SchemaSegment[] = [];

    const schemaEntries = Object.entries(
      this.config.schema.components?.schemas || {},
    );

    for await (const [name, schema] of schemaEntries) {
      let result = schema;

      while ('$ref' in result) {
        result = await this.walker.getByRef(result.$ref);
      }

      schemas.push(
        new SchemaSegment({
          data: {
            name,
            schema: result,
          },
          walker: this.walker,
          engine: this.config.engine,
        }),
      );
    }

    return schemas;
  }
}
