import { AnyObject, Maybe } from 'yammies/utils/types';

import { CodegenSwaggerSchemaConfig } from '../../codegen-swagger-schema/codegen-swagger-schema.types.js';

export interface OASchemaLoaderConfig {
  mainConfig: CodegenSwaggerSchemaConfig;
}

export interface OASchemaLoaderLoadPayload {
  input: Maybe<string | AnyObject>;
  requestOptions?: RequestInit;
}
