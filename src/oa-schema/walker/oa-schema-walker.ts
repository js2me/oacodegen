import { OpenAPIV3 } from 'openapi-types';

export interface OASchemaWalker {
  schema: OpenAPIV3.Document;
  resolveSchema(
    schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
  ): Promise<OpenAPIV3.SchemaObject | null>;
  getByRef(ref: string): Promise<any>;
}
