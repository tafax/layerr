
import { MessageBus } from '../bus/message-bus';
import { MessageHandlerMiddleware } from '../message-handler/message-handler.middleware';
import { IdentityMessageTypeExtractor } from '../message-handler/message-mapper/extractor/identity.message-type-extractor';
import { MessageHandlerPair } from '../message-handler/message-mapper/handler-lookup/collection/abstract-collection.handler-lookup';
import { CollectionHandlerLookup } from '../message-handler/message-mapper/handler-lookup/collection/collection.handler-lookup';
import { MessageMapper } from '../message-handler/message-mapper/message.mapper';

/**
 * Defines the factory to create a generic bus where the message can be anything and
 * handlers are functions.
 */
export class GeneralPurposeBusFactory {

  /**
   * Creates the message bus for the generic use.
   */
  static Create(mapping: MessageHandlerPair<Function>[]): MessageBus<any> {
    const collection = new CollectionHandlerLookup(mapping);
    const extractor = new IdentityMessageTypeExtractor();
    const messageMapper = new MessageMapper(collection, extractor);
    return new MessageBus<any>([
      new MessageHandlerMiddleware(messageMapper)
    ]);
  }

}
