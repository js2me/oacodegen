import { upperFirst } from 'lodash-es';
import { OpenAPIV3 } from 'openapi-types';

import { Segment } from './segment.js';

interface SchemaSegmentInput {
  name: string;
  schema: OpenAPIV3.SchemaObject;
}

export class SchemaSegment extends Segment<SchemaSegmentInput> {
  get readableName() {
    const formatParams = this.config.mainConfig.formatParams;

    if (formatParams?.schemaNames?.customFn) {
      return formatParams.schemaNames.customFn(
        this.config.input.name,
        this.config.input.schema,
      );
    }

    const formattedName = upperFirst(this.config.input.name).replaceAll(
      /\s/g,
      '',
    );

    const { suffix, prefix } = formatParams?.schemaNames ?? {};

    return `${prefix ?? ''}${formattedName}${suffix ?? ''}`;
  }

  get description() {
    return this.config.input.schema.description ?? '';
  }

  get title() {
    return this.config.input.schema.title ?? '';
  }
}
