import { CodegenTemplate } from './codegen-template/codegen-template.js';

export interface OASchemaCodegen {
  template(
    strings: TemplateStringsArray,
    ...args: any[]
  ): Promise<CodegenTemplate>;
}
