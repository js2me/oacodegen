import { Engine } from '../../engine/engine.js';
import { OAInternalSchema } from '../../oa-internal-schema/oa-internal-schema.js';

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

export interface GenerateConfig {
  codegen: OASchemaCodegen;
  schema: OAInternalSchema;
  engine: Engine;
}
