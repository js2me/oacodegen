import {
  OASchemaCodegen,
  OASchemaCodegenGenerateParams,
  OASchemaLoader,
  OASchemaLoaderLoadPayload,
  OASchemaParser,
  OASchemaWalker,
} from '../oa-schema/index.js';
import { Logger } from '../utils/index.js';

export interface CodegenSwaggerSchemaConfig {
  inputSchemaPayload: OASchemaLoaderLoadPayload;
  generateParams: OASchemaCodegenGenerateParams;
  logLevel?: keyof Logger;
  formatParams?: {
    schemaNames?: {
      customFn?: (raw: string, content?: any) => string;
      prefix?: string;
      suffix?: string;
    };
  };
  overrides?: {
    loader?: OASchemaLoader;
    parser?: OASchemaParser;
    codegen?: OASchemaCodegen;
    walker?: OASchemaWalker;
  };
}
