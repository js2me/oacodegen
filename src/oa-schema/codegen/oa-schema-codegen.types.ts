import { Engine } from '../../engine/engine.js';

import { OASchemaCodegen } from './oa-schema-codegen.js';

export interface OASchemaCodegenConfig {
  engine: Engine;
}

export interface OASchemaCodegenGenerateParams {
  generationFn?: (
    codegen: OASchemaCodegen,
    engine: Engine,
  ) => Promise<void> | void;
}
