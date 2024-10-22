import { Engine } from '../../engine/engine.js';
import { OASchemaWalker } from '../../oa-schema/walker/oa-schema-walker.js';

export interface SegmentConfig<Input> {
  data: Input;
  walker: OASchemaWalker;
  engine: Engine;
}

export class Segment<Data> {
  data: Data;

  constructor(protected config: SegmentConfig<Data>) {
    this.data = config.data;
  }
}
