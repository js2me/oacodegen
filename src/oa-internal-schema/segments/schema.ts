import { upperFirst } from 'lodash-es';
import { OpenAPIV3 } from 'openapi-types';

import { Segment } from './segment.js';

interface SchemaSegmentData {
  name: string;
  schema: OpenAPIV3.SchemaObject;
}

export class SchemaSegment extends Segment<SchemaSegmentData> {
  get readableName() {
    const formatParams = this.config.engine.config.formatParams;

    if (formatParams?.schemaNames?.customFn) {
      return formatParams.schemaNames.customFn(
        this.config.data.name,
        this.config.data.schema,
      );
    }

    const formattedName = upperFirst(this.config.data.name).replaceAll(
      /\s/g,
      '',
    );

    const { suffix, prefix } = formatParams?.schemaNames ?? {};

    return `${prefix ?? ''}${formattedName}${suffix ?? ''}`;
  }

  get description() {
    return this.config.data.schema.description ?? '';
  }

  get title() {
    return this.config.data.schema.title ?? '';
  }
}
