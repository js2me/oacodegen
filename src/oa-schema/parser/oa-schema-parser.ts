import { AnyObject } from 'yammies/utils/types';

import { OAInternalSchema } from '../../oa-internal-schema/oa-internal-schema.js';

export interface OASchemaParser {
  parse(jsonSchema: AnyObject): Promise<OAInternalSchema>;
}
