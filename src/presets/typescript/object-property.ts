import { SchemaSegment } from '../../oa-internal-schema/segments/schema/index.js';
import { CodegenTemplate } from '../../oa-schema/codegen/codegen-template/codegen-template.js';
import { PresetFn } from '../../oa-schema/index.js';

import { dataContractJsdocComments } from './data-contract-jsdoc-comments.js';
import { inlineType } from './inline-type.js';

/**
 * key: value
 */
export const objectProperty: PresetFn<{
  name: string;
  segment: SchemaSegment;
  interfaceSegment: SchemaSegment;
}> = async ({ name: propertName, segment, interfaceSegment }, codegen) => {
  codegen.logger.debug(propertName, segment, interfaceSegment);

  const interfaceSchemaData = interfaceSegment.data.schema;

  const isRequired = interfaceSchemaData?.required?.includes(propertName);

  const propertyContent = await codegen.exec(inlineType, segment);

  let template: CodegenTemplate;

  if (isRequired) {
    template =
      await codegen.template/* ts */ `${propertName}: ${propertyContent};\n  `;
  } else {
    template =
      await codegen.template/* ts */ `${propertName}?: ${propertyContent};\n  `;
  }

  const jsdocComments = await codegen.exec(dataContractJsdocComments, segment);

  const formattedJsdocComments = jsdocComments && `\n  ${jsdocComments}\n  `;

  template.content = `${formattedJsdocComments}${template.content}`;

  return template;
};
