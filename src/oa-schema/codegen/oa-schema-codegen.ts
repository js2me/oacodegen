import { OASchemaCodegenGenerateParams } from './oa-schema-codegen.types.js';

export interface OASchemaCodegen {
  generate(params: OASchemaCodegenGenerateParams): Promise<void>;
}
