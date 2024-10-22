import { OAInternalSchema } from '../oa-internal-schema/oa-internal-schema.js';
import { CodegenTemplateImpl } from '../oa-schema/codegen/codegen-template/codegen-template.impl.js';
import { OASchemaCodegenImpl } from '../oa-schema/codegen/oa-schema-codegen.impl.js';
import {
  OASchemaCodegen,
  OASchemaLoaderImpl,
  OASchemaLoaderLoadPayload,
  OASchemaParserImpl,
  OASchemaWalkerImpl,
} from '../oa-schema/index.js';
import { Logger } from '../utils/index.js';

import { Engine } from './engine.js';

export interface EngineEntityClasses {
  loader?: typeof OASchemaLoaderImpl;
  parser?: typeof OASchemaParserImpl;
  codegen?: typeof OASchemaCodegenImpl;
  codegenTemplate?: typeof CodegenTemplateImpl;
  walker?: typeof OASchemaWalkerImpl;
}

export interface EngineConfig {
  inputSchemaPayload: OASchemaLoaderLoadPayload;
  generate: (
    codegen: OASchemaCodegen,
    schema: OAInternalSchema,
    engine: Engine,
  ) => Promise<void> | void;
  logLevel?: keyof Logger;
  formatParams?: {
    schemaNames?: {
      customFn?: (raw: string, content?: any) => string;
      prefix?: string;
      suffix?: string;
    };
  };
  overrides?:
    | EngineEntityClasses
    | ((engine: Engine) => EngineEntityClasses | Promise<EngineEntityClasses>);
}
