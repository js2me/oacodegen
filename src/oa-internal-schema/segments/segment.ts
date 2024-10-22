import { Engine } from '../../engine/engine.js';
import { OASchemaWalker } from '../../oa-schema/walker/oa-schema-walker.js';

interface SegmentConfig<Input> {
  data: Input;
  walker: OASchemaWalker;
  engine: Engine;
}

export class Segment<Data> {
  data: any;

  constructor(protected config: SegmentConfig<Data>) {
    this.data = config.data;
  }
}
