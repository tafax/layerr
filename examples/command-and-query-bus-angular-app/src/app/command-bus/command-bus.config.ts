
import { MessageHandlerPair } from '@layerr/bus';
import { TestCommandHandler } from './command-handler/test.command-handler';
import { TestCommand } from './command/test.command';

/**
 * All the mappings that will be used to resolve an handler
 * given a specific command to handle.
 */
export const COMMAND_MAPPING_COLLECTION: MessageHandlerPair[] = [
  { message: TestCommand, handler: TestCommandHandler }
];
