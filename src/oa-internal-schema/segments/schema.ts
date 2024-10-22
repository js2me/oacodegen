import { upperFirst } from 'lodash-es';
import { OpenAPIV3 } from 'openapi-types';
import { Maybe } from 'yammies/utils/types';

import { Segment, SegmentConfig } from './segment.js';

export interface SchemaSegmentData {
  name?: string;
  schema: Maybe<OpenAPIV3.SchemaObject>;
}

export class SchemaSegment extends Segment<SchemaSegmentData> {
  constructor(config: SegmentConfig<SchemaSegmentData>) {
    super(config);

    if (!this.data.schema?.type && !!this.data.schema?.properties) {
      this.data.schema.type = 'object';
    }
  }

  get nullable() {
    return !!(
      this.data.schema &&
      (this.data.schema.nullable ||
        // @ts-expect-error possible field
        this.data.schema['x-nullable'] ||
        // @ts-expect-error possible value
        this.data.schema?.type === 'null' ||
        this.data.schema?.type === null)
    );
  }

  get readableName() {
    const formatParams = this.config.engine.config.formatParams;

    if (formatParams?.schemaNames?.customFn) {
      return formatParams.schemaNames.customFn(
        this.config.data.name ?? '',
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
}
