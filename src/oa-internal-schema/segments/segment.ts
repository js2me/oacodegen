import { Engine } from '../../engine/engine.js';
import { OASchemaWalker } from '../../oa-schema/walker/oa-schema-walker.js';
import { OAInternalSchema } from '../oa-internal-schema.js';

export interface SegmentConfig<Input> {
  data: Input;
  walker: OASchemaWalker;
  internalSchema: OAInternalSchema;
  engine: Engine;
}

export class Segment<Data> {
  data: Data;

  constructor(protected config: SegmentConfig<Data>) {
    this.data = config.data;
  }
}
