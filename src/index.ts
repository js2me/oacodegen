import { EngineImpl } from './engine/engine.impl.js';

export * from './oa-schema/index.js';
export * from './engine/index.js';
export * from './utils/index.js';
export * from './oa-internal-schema/index.js';

export const codegenSwaggerSchema = EngineImpl.run;

EngineImpl.run({
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
  generate: async (codegen, internalSchema) => {
    const schemas = await internalSchema.getSchemas();

    const template = codegen.template/* ts */ `
${schemas
  .map((schema) => {
    return /* ts */ `
type ${schema.readableName} = any;
`;
  })
  .join('\n')}
`;

    template.save({
      path: './file.ts',
    });
  },
});
