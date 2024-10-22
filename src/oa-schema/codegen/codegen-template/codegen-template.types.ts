import { Engine } from '../../../engine/engine.js';

export interface CodegenTemplateConfig {
  engine: Engine;
  content?: string;
}

export interface CodegenTemplateSaveParams {
  path: string;
}
