import { entries } from 'lodash-es';

import { SchemaSegment } from '../../oa-internal-schema/segments/schema/index.js';
import { PresetFn } from '../../oa-schema/index.js';

import { dataContractJsdocComments } from './data-contract-jsdoc-comments.js';
import { objectProperty } from './object-property.js';

export const dataContract: PresetFn<SchemaSegment> = async (
  segment,
  codegen,
) => {
  codegen.logger.debug(segment);

  const jsdocComments = await codegen.exec(dataContractJsdocComments, segment);

  const { details } = segment;

  if (details.type === 'object') {
    const properties = await details.getProperties();

    return codegen.template/* ts */ `
      ${jsdocComments}
      export interface ${segment.readableName} {
        ${entries(properties).map(async ([name, segment]) => codegen.exec(objectProperty, { name, segment, interfaceSegment: segment }))}
      };
    `;
  }

  return codegen.template/* ts */ `
    ${jsdocComments}
    export type ${segment.readableName} = ${details.type};
  `;
};
