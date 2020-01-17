
import { MessageHandlerPair } from '@layerr/bus';
import { TestQueryHandler } from './query-handler/test.query-handler';
import { TestQuery } from './query/test.query';

/**
 * All the mappings that will be used to resolve an handler
 * given a specific query to handle.
 */
export const QUERY_MAPPING_COLLECTION: MessageHandlerPair[] = [
  { message: TestQuery, handler: TestQueryHandler }
];
