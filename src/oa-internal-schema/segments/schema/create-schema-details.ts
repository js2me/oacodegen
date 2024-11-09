import { OpenAPIV3 } from 'openapi-types';
import { Maybe } from 'yammies/utils/types';

import { AllOfSchemaDetails } from './details/all-of.js';
import { AnyOfSchemaDetails } from './details/any-of.js';
import { BooleanSchemaDetails } from './details/boolean.js';
import { NumberSchemaDetails } from './details/number.js';
import { ObjectSchemaDetails } from './details/object.js';
import { OneOfSchemaDetails } from './details/one-of.js';
import { StringSchemaDetails } from './details/string.js';
import { UnknownSchemaDetails } from './details/unknown.js';
import { SchemaDetailsConfig } from './schema-details.js';

export const createSchemaDetails = (
  schema: Maybe<OpenAPIV3.SchemaObject>,
  config: Omit<SchemaDetailsConfig<any>, 'type'>,
) => {
  if (schema && 'oneOf' in schema) {
    return new OneOfSchemaDetails({
      ...config,
      type: 'one-of',
    });
  }

  if (schema && 'allOf' in schema) {
    return new AllOfSchemaDetails({
      ...config,
      type: 'all-of',
    });
  }

  if (schema && 'anyOf' in schema) {
    return new AnyOfSchemaDetails({
      ...config,
      type: 'any-of',
    });
  }

  switch (schema?.type) {
    case 'object': {
      return new ObjectSchemaDetails({
        ...config,
        type: 'object',
      });
    }
    case 'integer':
    case 'number': {
      return new NumberSchemaDetails({
        ...config,
        type: 'number',
      });
    }
    case 'boolean': {
      return new BooleanSchemaDetails({
        ...config,
        type: 'boolean',
      });
    }
    case 'string': {
      return new StringSchemaDetails({
        ...config,
        type: 'string',
      });
    }
    default: {
      return new UnknownSchemaDetails({
        ...config,
        type: 'unknown',
      });
    }
  }
};
