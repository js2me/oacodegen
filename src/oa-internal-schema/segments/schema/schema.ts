import { upperFirst, words } from 'lodash-es';
import { OpenAPIV3 } from 'openapi-types';
import { Maybe, ValueOf } from 'yammies/utils/types';

import { Logger, LoggerImpl } from '../../../utils/index.js';
import { Segment, SegmentConfig } from '../segment.js';

import { BooleanSchemaDetails } from './details/boolean.js';
import { NumberSchemaDetails } from './details/number.js';
import { ObjectSchemaDetails } from './details/object.js';
import { StringSchemaDetails } from './details/string.js';
import { UnknownSchemaDetails } from './details/unknown.js';

export interface SchemaSegmentData {
  name?: string;
  schema: Maybe<OpenAPIV3.SchemaObject>;
}

const schemaDetailVariants = {
  object: ObjectSchemaDetails,
  unknown: UnknownSchemaDetails,
  string: StringSchemaDetails,
  number: NumberSchemaDetails,
  boolean: BooleanSchemaDetails,
};

export class SchemaSegment extends Segment<SchemaSegmentData> {
  protected logger: Logger;

  details: InstanceType<ValueOf<typeof schemaDetailVariants>>;

  constructor(config: SegmentConfig<SchemaSegmentData>) {
    super(config);

    this.logger = new LoggerImpl({ ...config, name: 'schema-segment' });

    if (!this.data.schema?.type && !!this.data.schema?.properties) {
      this.data.schema.type = 'object';
    }

    this.logger.log(this.data.schema?.type);

    switch (this.data.schema?.type) {
      case 'object': {
        this.details = new schemaDetailVariants.object({
          segment: this,
          engine: this.config.engine,
          internalSchema: this.config.internalSchema,
          walker: this.config.walker,
        });

        break;
      }
      case 'integer':
      case 'number': {
        this.details = new schemaDetailVariants.number({
          segment: this,
          engine: this.config.engine,
          internalSchema: this.config.internalSchema,
          walker: this.config.walker,
        });

        break;
      }
      case 'boolean': {
        this.details = new schemaDetailVariants.boolean({
          segment: this,
          engine: this.config.engine,
          internalSchema: this.config.internalSchema,
          walker: this.config.walker,
        });

        break;
      }
      case 'string': {
        this.details = new schemaDetailVariants.string({
          segment: this,
          engine: this.config.engine,
          internalSchema: this.config.internalSchema,
          walker: this.config.walker,
        });

        break;
      }
      default: {
        this.details = new schemaDetailVariants.unknown({
          segment: this,
          engine: this.config.engine,
          internalSchema: this.config.internalSchema,
          walker: this.config.walker,
        });
      }
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
