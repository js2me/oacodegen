import { AnyObject } from 'yammies/utils/types';

import { CodegenSwaggerSchemaConfig } from '../../codegen-swagger-schema/index.js';
import { OASchemaWalker } from '../../oa-schema/walker/oa-schema-walker.js';

interface SegmentConfig<Input extends AnyObject> {
  input: Input;
  walker: OASchemaWalker;
  mainConfig: CodegenSwaggerSchemaConfig;
}

export class Segment<Input extends AnyObject> {
  constructor(protected config: SegmentConfig<Input>) {}
}
