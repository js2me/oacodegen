import { ConvertInputOptions } from 'swagger2openapi';
import { AnyObject } from 'yammies/utils/types';

import { CodegenSwaggerSchemaConfig } from '../../codegen-swagger-schema/index.js';

export interface OASchemaParserConfig {
  mainConfig: CodegenSwaggerSchemaConfig;
}

export interface OASchemaParserParseParams {
  /**
   * It can be Swagger OA 2.0 OA 3.0 schema
   */
  schema: AnyObject;
  /**
   * Converter options to OA 3.0. Works only if input schema is Swagger OA 2.0
   */
  converterOptions?: Partial<ConvertInputOptions>;
}
