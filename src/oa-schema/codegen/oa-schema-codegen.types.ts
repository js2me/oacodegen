import { AllPropertiesOptional } from 'yammies/utils/types';

import { Engine } from '../../engine/engine.js';
import { OAInternalSchema } from '../../oa-internal-schema/oa-internal-schema.js';
import { FileSystem, Logger } from '../../utils/index.js';

import { CodegenTemplate } from './codegen-template/codegen-template.js';
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

export type PresetFn<Input, Meta = void> = (
  input: Input,
  engine: GeneratePresetsEngine,
  ...args: Meta extends void
    ? [meta?: Meta]
    : AllPropertiesOptional<Meta> extends true
      ? [meta?: Partial<Meta>]
      : [meta: Meta]
) => Promise<CodegenTemplate> | CodegenTemplate;

export interface GeneratePresetsEngine {
  schema: OAInternalSchema;
  engine: Engine;
  logger: Logger;
  fs: FileSystem;

  template(
    strings: TemplateStringsArray,
    ...args: any[]
  ): Promise<CodegenTemplate>;

  exec<Input, Meta = void>(
    preset: PresetFn<Input, Meta>,
    input: Input,
    ...args: Meta extends void
      ? [meta?: Meta]
      : AllPropertiesOptional<Meta> extends true
        ? [meta?: Partial<Meta>]
        : [meta: Meta]
  ): Promise<CodegenTemplate> | CodegenTemplate;
}
