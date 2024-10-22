import { CodegenTemplateSaveParams } from './codegen-template.types.js';

export interface CodegenTemplate {
  content: string;

  save(params: CodegenTemplateSaveParams): Promise<void>;
}
