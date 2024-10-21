import { OpenAPIV3 } from 'openapi-types';

import { CodegenSwaggerSchemaConfig } from '../codegen-swagger-schema/index.js';
import {
  OASchemaWalkerImpl,
  OASchemaWalker,
} from '../oa-schema/walker/index.js';
import { Logger, LoggerImpl } from '../utils/index.js';

import { OAInternalSchema } from './oa-internal-schema.js';
import { SchemaSegment } from './segments/schema.js';

export class OAInternalSchemaImpl implements OAInternalSchema {
  protected logger: Logger;
  walker: OASchemaWalker;

  constructor(
    protected schema: OpenAPIV3.Document,
    protected mainConfig: CodegenSwaggerSchemaConfig,
  ) {
    this.logger = new LoggerImpl({ mainConfig, name: 'oa-internal-schema' });
    this.walker =
      mainConfig.overrides?.walker ??
      new OASchemaWalkerImpl({ schema, mainConfig });

    this.logger.debug('initialized');
  }

  async getSchemas() {
    const schemas: SchemaSegment[] = [];
    const schemaEntries = Object.entries(this.schema.components?.schemas || {});

    for await (const [name, schema] of schemaEntries) {
      let result = schema;

      while ('$ref' in result) {
        result = await this.walker.getByRef(result.$ref);
      }

      schemas.push(
        new SchemaSegment({
          input: {
            name,
            schema: result,
          },
          walker: this.walker,
          mainConfig: this.mainConfig,
        }),
      );
    }

    return schemas;
  }
}
