import { SchemaDetailsAbstract } from '../schema-details-abstract.js';
export class NumberSchemaDetails extends SchemaDetailsAbstract<'number'> {
  type = 'number' as const;
}
