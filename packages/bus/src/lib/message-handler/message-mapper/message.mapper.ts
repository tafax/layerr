import { ClassResolverInterface } from '@layerr/core';
import { HandlerLookupInterface } from '../handler-lookup/handler-lookup.interface';
import { AbstractMessageMapper } from './abstract-message-mapper';
import { MessageTypeExtractorInterface } from '../extractor/message-type-extractor.interface';

/**
 * Provides the ability to resolve a specific handler for a given message.
 * It is based on the handling collection and uses an extractor to
 * get the identifier of a message and a resolver to instantiate a new handler.
 */
export class MessageMapper extends AbstractMessageMapper {
  constructor(
    messageLookup: HandlerLookupInterface,
    extractor: MessageTypeExtractorInterface,
    private readonly _classResolver: ClassResolverInterface,
  ) {
    super(messageLookup, extractor);
  }

  /**
   * @inheritDoc
   */
  //eslint-disable-next-line @typescript-eslint/ban-types
  getHandlers(message: unknown): Function[] {
    // Gets the handler based on the message.
    const handlerIdentifier = this._getHandlerIdentifier(message);
    // Resolves the handler function.
    //eslint-disable-next-line @typescript-eslint/ban-types
    const handler = this._classResolver.resolve<Record<string, Function>>(handlerIdentifier as never);
    return [ handler.handle.bind(handler) ];
  }
}
