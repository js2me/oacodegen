import { CodegenTemplateSaveParams } from './codegen-template.types.js';

// eslint-disable-next-line @typescript-eslint/ban-types
export interface CodegenTemplate extends String {
  content: string;

  toString(): string;

  valueOf(): string;

  save(params: CodegenTemplateSaveParams): Promise<void>;
}
