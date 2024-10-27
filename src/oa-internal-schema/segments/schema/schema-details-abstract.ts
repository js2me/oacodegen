import type { Engine } from '../../../engine/engine.js';
import type { OASchemaWalker } from '../../../oa-schema/index.js';
import { Logger, LoggerImpl } from '../../../utils/index.js';
import type { OAInternalSchema } from '../../oa-internal-schema.js';

import type { SchemaSegment } from './schema.js';

export abstract class SchemaDetailsAbstract<T> {
  abstract type: T;

  logger: Logger;

  constructor(
    protected config: {
      segment: SchemaSegment;
      walker: OASchemaWalker;
      internalSchema: OAInternalSchema;
      engine: Engine;
    },
  ) {
    this.logger = new LoggerImpl({
      engine: this.config.engine,
      name: `schema-details-${this.config.segment.readableName}`,
    });
  }
}
