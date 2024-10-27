import { SchemaDetailsAbstract } from '../schema-details-abstract.js';
export class StringSchemaDetails extends SchemaDetailsAbstract<'string'> {
  type = 'string' as const;
}
