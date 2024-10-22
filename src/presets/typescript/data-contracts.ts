import { SchemaSegment } from '../../oa-internal-schema/segments/schema.js';
import { LoggerImpl } from '../../utils/index.js';
import { PresetFn } from '../preset-fn.js';

import { dataContract } from './data-contract.js';

export const dataContracts: PresetFn<SchemaSegment[]> = async (
  segments,
  config,
) => {
  const logger = new LoggerImpl({
    engine: config.engine,
    name: 'data-contracts',
  });

  logger.debug(segments);

  const dataContractTemplates = await Promise.all(
    segments.map((segment) => dataContract(segment, config)),
  );

  return config.codegen.template/* ts */ `
/* eslint-disable */
/* tslint:disable */
  
${dataContractTemplates.join('\n\n')}
`;
};
