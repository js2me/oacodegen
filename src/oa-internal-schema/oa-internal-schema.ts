import { SchemaSegment } from './segments/schema.js';

export interface OAInternalSchema {
  getSchemas(): Promise<SchemaSegment[]>;
}
