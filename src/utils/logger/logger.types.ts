import { CodegenSwaggerSchemaConfig } from '../../codegen-swagger-schema/index.js';

export interface LoggerConfig {
  name?: string;
  mainConfig: CodegenSwaggerSchemaConfig;
}
