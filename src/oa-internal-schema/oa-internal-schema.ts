import { OASchemaWalker } from '../oa-schema/index.js';

import { SchemaSegment } from './segments/schema.js';

export interface OAInternalSchema {
  walker: OASchemaWalker;

  getSchemas(): Promise<SchemaSegment[]>;
}
