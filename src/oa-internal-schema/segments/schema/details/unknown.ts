import { SchemaDetailsAbstract } from '../schema-details-abstract.js';

export class UnknownSchemaDetails extends SchemaDetailsAbstract<'unknown'> {
  type = 'unknown' as const;
}
