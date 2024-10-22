import { OpenAPIV3 } from 'openapi-types';

import { Engine } from '../../engine/engine.js';

export interface OASchemaWalkerConfig {
  schema: OpenAPIV3.Document;
  /**
   * Can be url to schema, or FS path, otherwise it is # (root)
   * defaults - #
   */
  schemaAddress?: string;
  engine: Engine;
}
