import { OpenAPIV3 } from 'openapi-types';

import { OASchemaWalker } from '../oa-schema/walker/index.js';
import { Logger, LoggerImpl } from '../utils/index.js';

import { OAInternalSchema } from './oa-internal-schema.js';
import { OAInternalSchemaConfig } from './oa-internal-schema.types.js';
import { SchemaSegment } from './segments/schema/index.js';

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
  }

  async toSegment(
    type: 'schema',
    data: {
      name?: string;
      schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
    },
  ): Promise<SchemaSegment> {
    return new SchemaSegment({
      internalSchema: this,
      data: {
        name: data.name,
        schema: await this.walker.resolveSchema(data.schema),
      },
      walker: this.walker,
      engine: this.config.engine,
    });
  }

  async getSchemas() {
    const schemas: SchemaSegment[] = [];

    const schemaEntries = Object.entries(
      this.config.schema.components?.schemas || {},
    );

    for await (const [name, schema] of schemaEntries) {
      schemas.push(await this.toSegment('schema', { name, schema }));
    }

    return schemas;
  }
}
