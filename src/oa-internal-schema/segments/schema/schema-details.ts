import type { Engine } from '../../../engine/engine.js';
import type { OASchemaWalker } from '../../../oa-schema/index.js';
import { Logger, LoggerImpl } from '../../../utils/index.js';
import type { OAInternalSchema } from '../../oa-internal-schema.js';

import type { SchemaSegment } from './schema.js';

export interface SchemaDetailsConfig<T> {
  type: T;
  segment: SchemaSegment;
  walker: OASchemaWalker;
  internalSchema: OAInternalSchema;
  engine: Engine;
}

export class SchemaDetails<T> {
  type: T;
  logger: Logger;

  constructor(protected config: SchemaDetailsConfig<T>) {
    this.type = config.type;
    this.logger = new LoggerImpl({
      engine: this.config.engine,
      name: `schema-details-${this.config.segment.readableName}`,
    });
  }
}
