import { MessageBus } from '../bus/message-bus';
import { MessageHandlerMiddleware } from '../message-handler/message-handler.middleware';
import { IdentityMessageTypeExtractor } from '../message-handler/extractor/identity.message-type-extractor';
import { MessageHandlerPair } from '../message-handler/handler-lookup/collection/abstract-collection.handler-lookup';
import { CollectionHandlerLookup } from '../message-handler/handler-lookup/collection/collection.handler-lookup';
import { FunctionMessageMapper } from '../message-handler/message-mapper/function.message-mapper';

/**
 * Defines the factory to create a generic bus where the message can be anything and
 * handlers are functions.
 */
export class GeneralPurposeBusFactory {

  /**
   * Creates the message bus for the generic use.
   */
  static Create(mapping: MessageHandlerPair<unknown>[]): MessageBus<unknown> {
    const collection = new CollectionHandlerLookup(mapping);
    const extractor = new IdentityMessageTypeExtractor();
    const messageMapper = new FunctionMessageMapper(collection, extractor);
    return new MessageBus<unknown>([
      new MessageHandlerMiddleware(messageMapper),
    ]);
  }

}
