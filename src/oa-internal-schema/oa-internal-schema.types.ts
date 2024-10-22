import { OpenAPIV3 } from 'openapi-types';

import { Engine } from '../engine/engine.js';
import { OA3ModifiedDocument } from '../oa-schema/index.js';

export interface OAInternalSchemaConfig {
  schema: OpenAPIV3.Document | OA3ModifiedDocument;
  schemaAddress?: string;
  engine: Engine;
}
