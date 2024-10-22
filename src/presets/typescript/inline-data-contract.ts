import { entries } from 'lodash-es';

import { SchemaSegment } from '../../oa-internal-schema/segments/schema.js';
import { CodegenTemplate } from '../../oa-schema/codegen/codegen-template/codegen-template.js';
import { LoggerImpl } from '../../utils/index.js';
import { PresetFn } from '../preset-fn.js';

import { dataContractJsdocComments } from './data-contract-jsdoc-comments.js';
import { interfaceProperty } from './interface-property.js';

export const inlineDataContract: PresetFn<SchemaSegment> = async (
  segment,
  config,
) => {
  const logger = new LoggerImpl({
    engine: config.engine,
    name: 'inline-data-contract',
  });

  logger.debug(segment);

  const jsdocComments = await dataContractJsdocComments(segment, config);

  const data = segment.data.schema;

  let template: CodegenTemplate = await config.codegen.template/* ts */ `any`;

  switch (data?.type) {
    case 'object': {
      {
        template = await config.codegen.template/* ts */ `
    ${jsdocComments}
    {
      ${entries(data.properties).map(async ([propertName, propertySchema]) => interfaceProperty({ name: propertName, schema: propertySchema, interfaceSegment: segment }, config))}
    };
      `;
      }
      break;
    }
    case 'integer': {
      template = await config.codegen.template/* ts */ `number`;
      break;
    }
    case 'string':
    case 'number':
    case 'boolean': {
      template = await config.codegen.template/* ts */ `${data.type}`;
      break;
    }
    default: {
      break;
    }
  }

  if (segment.nullable) {
    template.content += ' | null';
  }

  return template;
};
