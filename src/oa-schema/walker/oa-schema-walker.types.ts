import { OpenAPIV3 } from 'openapi-types';

import { CodegenSwaggerSchemaConfig } from '../../codegen-swagger-schema/codegen-swagger-schema.types.js';

export interface OASchemaWalkerConfig {
  schema: OpenAPIV3.Document;
  mainConfig: CodegenSwaggerSchemaConfig;
}
