import { entries } from 'lodash-es';

import { SchemaSegment } from '../../oa-internal-schema/segments/schema/index.js';
import { CodegenTemplate } from '../../oa-schema/codegen/codegen-template/codegen-template.js';
import { PresetFn } from '../../oa-schema/index.js';

import { dataContractJsdocComments } from './data-contract-jsdoc-comments.js';
import { objectProperty } from './object-property.js';

/**
 * string | number | object
 */
export const inlineType: PresetFn<SchemaSegment> = async (segment, codegen) => {
  codegen.logger.debug(segment);

  const jsdocComments = await codegen.exec(dataContractJsdocComments, segment);

  const { nullable, details } = segment;

  let template: CodegenTemplate;

  codegen.logger.log('details', details.type);

  switch (details.type) {
    case 'object': {
      {
        const properties = await details.getProperties();

        template = await codegen.template/* ts */ `
    ${jsdocComments}
    { ${entries(properties).map(([name, segment]) => codegen.exec(objectProperty, { name, segment, interfaceSegment: segment }))} } ${nullable ? ' | null' : ''}
      `;
      }
      break;
    }
    case 'number': {
      template = await codegen.template`number ${nullable ? ' | null' : ''}`;
      break;
    }
    case 'string': {
      template = await codegen.template`string ${nullable ? ' | null' : ''}`;
      break;
    }
    case 'boolean': {
      template = await codegen.template`boolean ${nullable ? ' | null' : ''}`;
      break;
    }
    default: {
      template = await codegen.template`any`;
      break;
    }
  }

  return template;
};
