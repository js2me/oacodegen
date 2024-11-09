import { upperFirst, words } from 'lodash-es';
import { OpenAPIV3 } from 'openapi-types';
import { Maybe } from 'yammies/utils/types';

import { Logger, LoggerImpl } from '../../../utils/index.js';
import { Segment, SegmentConfig } from '../segment.js';

import { createSchemaDetails } from './create-schema-details.js';

export interface SchemaSegmentData {
  name?: string;
  schema: Maybe<OpenAPIV3.SchemaObject>;
}

export class SchemaSegment extends Segment<SchemaSegmentData> {
  protected logger: Logger;

  details: ReturnType<typeof createSchemaDetails>;

  constructor(config: SegmentConfig<SchemaSegmentData>) {
    super(config);

    this.logger = new LoggerImpl({ ...config, name: 'schema-segment' });

    if (!this.data.schema?.type && !!this.data.schema?.properties) {
      this.data.schema.type = 'object';
    }

    this.details = createSchemaDetails(this.data.schema, {
      segment: this,
      engine: this.config.engine,
      internalSchema: this.config.internalSchema,
      walker: this.config.walker,
    });
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

  get originalName() {
    return this.config.data.name;
  }

  get readableName() {
    const formatParams = this.config.engine.config.formatParams;

    if (formatParams?.schemaNames?.customFn) {
      return formatParams.schemaNames.customFn(
        this.originalName ?? '',
        this.config.data.schema,
      );
    }

    const formattedName = words(
      upperFirst(this.originalName).replaceAll(/\s/g, ''),
    ).join('');

    this.logger.debug('formattedName', formattedName);

    const { suffix, prefix } = formatParams?.schemaNames ?? {};

    return `${prefix ?? ''}${formattedName}${suffix ?? ''}`;
  }
}
