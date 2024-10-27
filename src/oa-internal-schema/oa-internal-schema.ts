import { OpenAPIV3 } from 'openapi-types';
import { Maybe } from 'yammies/utils/types';

import { OASchemaWalker } from '../oa-schema/index.js';

import { SchemaSegment } from './segments/schema/index.js';

export interface OAInternalSchema {
  walker: OASchemaWalker;

  getSchemas(): Promise<SchemaSegment[]>;

  toSegment(
    type: 'schema',
    data: {
      name?: string;
      schema?: Maybe<OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject>;
    },
  ): Promise<SchemaSegment>;
}
