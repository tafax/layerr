
import { ClassResolverInterface, ClassType } from '@swiss/core';
import { HandlerLookupInterface } from './handler-lookup/handler-lookup.interface';
import { MessageMapperInterface } from './message-mapper.interface';
import { MessageTypeExtractorInterface } from './extractor/message-type-extractor.interface';

/**
 * Provides the ability to resolve a specific handler for a given message.
 * It is based on the handling collection and uses an extractor to
 * get the identifier of a message and a resolver to instantiate a new handler.
 */
export class MessageMapper implements MessageMapperInterface {

  constructor(
    private _messageLookup: HandlerLookupInterface,
    private _extractor: MessageTypeExtractorInterface,
    private _classResolver: ClassResolverInterface,
  ) {}

  /**
   * @inheritDoc
   */
  getHandlers(message: any): Function[] {
    // Extracts the identifier.
    const identifier = this._extractor.extract(message);
    // Gets the handler based on the message identifier.
    const handlerIdentifier = <ClassType<any>>this._messageLookup.getValue(identifier);
    // If we have an array we return it.
    if (Array.isArray(handlerIdentifier)) {
      return handlerIdentifier;
    }
    // Resolves the handler function.
    const handler = this._classResolver.resolve<any>(handlerIdentifier);
    return [ handler.handle.bind(handler) ];
  }

}
