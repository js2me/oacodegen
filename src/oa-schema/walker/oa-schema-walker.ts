import { OpenAPIV3 } from 'openapi-types';

export interface OASchemaWalker {
  schema: OpenAPIV3.Document;
  getByRef(ref: string): Promise<any>;
}
