import { AnyObject, Maybe } from 'yammies/utils/types';

import { OASchemaLoaderLoadPayload } from './oa-schema-loader.types.js';

export interface OASchemaLoader {
  load(payload: OASchemaLoaderLoadPayload): Promise<Maybe<AnyObject>>;
}
