import { SchemaSegment } from '../../oa-internal-schema/segments/schema/index.js';
import { PresetFn } from '../../oa-schema/index.js';

import { dataContract } from './data-contract.js';

export const dataContracts: PresetFn<SchemaSegment[]> = async (
  segments,
  codegen,
) => {
  codegen.logger.debug(segments);

  const dataContractTemplates = await Promise.all(
    segments.map((schema) => codegen.exec(dataContract, schema)),
  );

  return codegen.template/* ts */ `
/* eslint-disable */
/* tslint:disable */
  
${dataContractTemplates.join('\n\n')}
`;
};
