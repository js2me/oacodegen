import { upperFirst, words } from 'lodash-es';
import { OpenAPIV3 } from 'openapi-types';
import { Maybe } from 'yammies/utils/types';

import { Logger, LoggerImpl } from '../../utils/index.js';

import { Segment, SegmentConfig } from './segment.js';

export interface SchemaSegmentData {
  name?: string;
  schema: Maybe<OpenAPIV3.SchemaObject>;
}

export class SchemaSegment extends Segment<SchemaSegmentData> {
  protected logger: Logger;

  constructor(config: SegmentConfig<SchemaSegmentData>) {
    super(config);

    this.logger = new LoggerImpl({ ...config, name: 'schema-segment' });

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

    const formattedName = words(
      upperFirst(this.config.data.name).replaceAll(/\s/g, ''),
    ).join('');

    this.logger.debug('formattedName', formattedName);

    const { suffix, prefix } = formatParams?.schemaNames ?? {};

    return `${prefix ?? ''}${formattedName}${suffix ?? ''}`;
  }
}
