import { entries } from 'lodash-es';

import { SchemaSegment } from '../../oa-internal-schema/segments/schema.js';
import { LoggerImpl } from '../../utils/index.js';
import { PresetFn } from '../preset-fn.js';

import { dataContractJsdocComments } from './data-contract-jsdoc-comments.js';
import { interfaceProperty } from './interface-property.js';

export const dataContract: PresetFn<SchemaSegment> = async (
  segment,
  config,
) => {
  const logger = new LoggerImpl({
    engine: config.engine,
    name: 'data-contract',
  });

  logger.debug(segment);

  const jsdocComments = await dataContractJsdocComments(segment, config);

  const data = segment.data.schema;

  if (data?.type === 'object') {
    return config.codegen.template/* ts */ ` 
${jsdocComments}
export interface ${segment.readableName} {
  ${entries(data.properties).map(async ([propertName, propertySchema]) => interfaceProperty({ name: propertName, schema: propertySchema, interfaceSegment: segment }, config))}
};
  `;
  }

  return config.codegen.template/* ts */ `
${jsdocComments}
export interface ${segment.readableName} {

};
`;
};
