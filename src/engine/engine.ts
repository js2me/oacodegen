import { OASchemaWalker } from '../oa-schema/index.js';

import { EngineConfig, EngineEntityClasses } from './engine.types.js';

export interface Engine {
  entityClasses: Required<EngineEntityClasses>;

  /**
   * User's configuration
   */
  config: EngineConfig;

  /**
   * Needed for cache
   */
  researchedSchemas: Map<string, OASchemaWalker>;

  /**
   * Segments - parts of converted OA3.0 schema
   * Needed for cache
   */
  researchedSegments: Map<string, any>;

  /**
   * Runs the main process
   */
  run(): Promise<void>;
}
