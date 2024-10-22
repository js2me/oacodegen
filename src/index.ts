import { EngineImpl } from './engine/engine.impl.js';
import { tsPresets } from './presets/index.js';

export * from './oa-schema/index.js';
export * from './engine/index.js';
export * from './utils/index.js';
export * from './oa-internal-schema/index.js';
export * from './presets/index.js';

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
      'https://raw.githubusercontent.com/acacode/swagger-typescript-api/refs/heads/main/tests/fixtures/schemas/v2.0/petstore-expanded.json',
  },
  generate: async (config) => {
    const schemas = await config.schema.getSchemas();

    const dataContractsTemplate = await tsPresets.dataContracts(
      schemas,
      config,
    );

    dataContractsTemplate.save({
      path: './codegen-output/file.ts',
    });
  },
});
