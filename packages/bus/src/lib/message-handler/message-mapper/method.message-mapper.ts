import { ClassResolverInterface } from '@layerr/core';
import { BusError } from '../../errors/bus.error';
import { MessageTypeExtractorInterface } from '../extractor/message-type-extractor.interface';
import { HandlerLookupInterface } from '../handler-lookup/handler-lookup.interface';
import { AbstractMessageMapper } from './abstract-message-mapper';

/**
 * Provides the ability to resolve a specific handler for a given message.
 * It is based on the handling collection and uses an extractor to
 * get the identifier of a message and a resolver to instantiate a new handler.
 */
export class MethodMessageMapper extends AbstractMessageMapper {
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

    // We expect an array of functions at this time.
    if (!Array.isArray(handlerIdentifier)) {
      throw new BusError(`We expect an array as [ Class, Method Name ]. ${typeof handlerIdentifier} given.`);
    }

    // Gets the class name and the method name from the array representation.
    const [ className, methodName ] = handlerIdentifier;

    // Resolves the handler function.
    const handler = this._classResolver.resolve<unknown>(className);
    return [ handler[methodName].bind(handler) ];
  }
}
