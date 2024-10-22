import { AnyObject, Maybe } from 'yammies/utils/types';

import { Engine } from '../../engine/engine.js';

export interface OASchemaLoaderConfig {
  engine: Engine;
}

export interface OASchemaLoaderLoadPayload {
  input: Maybe<string | AnyObject>;
  requestOptions?: RequestInit;
}
