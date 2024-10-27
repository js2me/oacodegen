import { SchemaDetailsAbstract } from '../schema-details-abstract.js';
import type { SchemaSegment } from '../schema.js';

export class ObjectSchemaDetails extends SchemaDetailsAbstract<'object'> {
  type = 'object' as const;

  async getProperties() {
    const properties = this.config.segment.data.schema?.properties || {};

    const result: Record<string, SchemaSegment> = {};

    for (const [name, schema] of Object.entries(properties)) {
      const resolvedSchema = await this.config.walker.resolveSchema(schema);

      this.logger.debug('resolvedscheam', name, resolvedSchema?.type);

      const schemaSegment = await this.config.internalSchema.toSegment(
        'schema',
        {
          schema: resolvedSchema,
        },
      );

      result[name] = schemaSegment;
    }

    return result;
  }
}
