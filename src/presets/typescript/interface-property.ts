import { OpenAPIV3 } from 'openapi-types';

import { SchemaSegment } from '../../oa-internal-schema/segments/schema.js';
import { CodegenTemplate } from '../../oa-schema/codegen/codegen-template/codegen-template.js';
import { LoggerImpl } from '../../utils/index.js';
import { PresetFn } from '../preset-fn.js';

import { dataContractJsdocComments } from './data-contract-jsdoc-comments.js';
import { inlineDataContract } from './inline-data-contract.js';

export const interfaceProperty: PresetFn<{
  name: string;
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  interfaceSegment: SchemaSegment;
}> = async (
  { name: propertName, schema: propertySchema, interfaceSegment },
  config,
) => {
  const logger = new LoggerImpl({
    engine: config.engine,
    name: 'interface-property',
  });

  logger.debug(propertName, propertySchema, interfaceSegment);

  const interfaceSchemaData = interfaceSegment.data.schema;

  const schema = await config.schema.walker.resolveSchema(propertySchema);
  const schemaSegment = await config.schema.toSegment('schema', {
    schema,
  });

  logger.log('data.required', interfaceSchemaData?.required);

  const isRequired = interfaceSchemaData?.required?.includes(propertName);

  const propertyContent = await inlineDataContract(schemaSegment, config);

  let template: CodegenTemplate;

  if (isRequired) {
    template = await config.codegen
      .template/* ts */ `${propertName}: ${propertyContent};\n  `;
  } else {
    template = await config.codegen
      .template/* ts */ `${propertName}?: ${propertyContent};\n  `;
  }

  const jsdocComments = await dataContractJsdocComments(schemaSegment, config);

  const formattedJsdocComments = jsdocComments && `\n  ${jsdocComments}\n  `;

  template.content = `${formattedJsdocComments}${template.content}`;

  return template;
};
