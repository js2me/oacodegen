import { SchemaDetailsAbstract } from '../schema-details-abstract.js';

export class BooleanSchemaDetails extends SchemaDetailsAbstract<'boolean'> {
  type = 'boolean' as const;
}
