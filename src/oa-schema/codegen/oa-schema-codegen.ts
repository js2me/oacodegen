import { OAInternalSchema } from '../../oa-internal-schema/oa-internal-schema.js';

import { CodegenTemplate } from './codegen-template/codegen-template.js';
import { GeneratePresetsEngine } from './oa-schema-codegen.types.js';

export interface OASchemaCodegen {
  template(
    strings: TemplateStringsArray,
    ...args: any[]
  ): Promise<CodegenTemplate>;
  createPresetsEngine(
    name: string,
    internalSchema: OAInternalSchema,
  ): GeneratePresetsEngine;
}
