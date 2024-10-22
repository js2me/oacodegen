import { OpenAPIV3 } from 'openapi-types';
import { ConvertInputOptions } from 'swagger2openapi';
import { AnyObject } from 'yammies/utils/types';

import { Engine } from '../../engine/engine.js';

export interface OASchemaParserConfig {
  engine: Engine;
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

export interface OA3ModifiedDocument extends OpenAPIV3.Document {
  __original: AnyObject;
}
