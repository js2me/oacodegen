import { CodegenSwaggerSchema } from './codegen-swagger-schema/codegen-swagger-schema.js';

export * from './oa-schema/index.js';

export const codegenSwaggerSchema = CodegenSwaggerSchema.run;

CodegenSwaggerSchema.run({
  generateParams: {},
  logLevel: 'debug',
  formatParams: {
    schemaNames: {
      suffix: 'DC',
    },
  },
  inputSchemaPayload: {
    input:
      'https://raw.githubusercontent.com/acacode/swagger-typescript-api/refs/heads/main/tests/fixtures/schemas/v2.0/authentiq.json',
  },
});
