import { AllPropertiesOptional } from 'yammies/utils/types';

import { CodegenTemplate } from '../oa-schema/codegen/codegen-template/codegen-template.js';
import { GenerateConfig } from '../oa-schema/index.js';

export type PresetFn<Input, Meta = void> = (
  input: Input,
  config: GenerateConfig,
  ...args: Meta extends void
    ? [meta?: Meta]
    : AllPropertiesOptional<Meta> extends true
      ? [meta?: Partial<Meta>]
      : [meta: Meta]
) => Promise<CodegenTemplate> | CodegenTemplate;
