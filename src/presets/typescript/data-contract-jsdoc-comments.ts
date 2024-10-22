import { compact } from 'lodash-es';
import { typeGuard } from 'yammies/type-guard';

import { SchemaSegment } from '../../oa-internal-schema/segments/schema.js';
import { stringifyValue } from '../../utils/formatting.js';
import { LoggerImpl } from '../../utils/index.js';
import { PresetFn } from '../preset-fn.js';

const formatDescription = (description: string, inline?: boolean) => {
  if (!description) return '';

  const hasMultipleLines = description.includes('\n');

  if (!hasMultipleLines) return description;

  if (inline) {
    return compact(description.split(/\n/g).map((part) => part.trim()))
      .join(' ')
      .valueOf();
  }

  return description.replaceAll(/\n$/g, '');
};

export const dataContractJsdocComments: PresetFn<SchemaSegment> = (
  segment,
  config,
) => {
  const logger = new LoggerImpl({
    engine: config.engine,
    name: 'data-contract-jsdoc-comments',
  });

  logger.debug(segment);

  const data = segment.data.schema;

  const jsdocComments = [
    data?.title && `@title ${data.title}`,
    data?.description && `@description ${formatDescription(data.description)}`,
    typeGuard.isDefined(data?.deprecated) && data.deprecated && '@deprecated',
    typeGuard.isDefined(data?.format) && `@format ${data.format}`,
    typeGuard.isDefined(data?.minimum) && `@min ${data.minimum}`,
    typeGuard.isDefined(data?.multipleOf) && `@multipleOf ${data.multipleOf}`,
    typeGuard.isDefined(data?.exclusiveMinimum) &&
      `@exclusiveMin ${data.exclusiveMinimum}`,
    typeGuard.isDefined(data?.maximum) && `@max ${data.maximum}`,
    typeGuard.isDefined(data?.minLength) && `@minLength ${data.minLength}`,
    typeGuard.isDefined(data?.maxLength) && `@maxLength ${data.maxLength}`,
    typeGuard.isDefined(data?.exclusiveMaximum) &&
      `@exclusiveMax ${data.exclusiveMaximum}`,
    typeGuard.isDefined(data?.maxItems) && `@maxItems ${data.maxItems}`,
    typeGuard.isDefined(data?.minItems) && `@minItems ${data.minItems}`,
    typeGuard.isDefined(data?.uniqueItems) &&
      `@uniqueItems ${data.uniqueItems}`,
    typeGuard.isDefined(data?.default) &&
      `@default ${stringifyValue(data!.default)}`,
    typeGuard.isDefined(data?.pattern) && `@pattern ${data.pattern}`,
    typeGuard.isDefined(data?.example) &&
      `@example ${stringifyValue(data!.example)}`,
  ].filter(Boolean);

  if (jsdocComments.length === 0) {
    return config.codegen.template``;
  }

  return config.codegen.template/* ts */ `
/**
${jsdocComments.map((comment) => ` * ${(comment as string).trim()}`).join('\n')}
 */
`;
};
