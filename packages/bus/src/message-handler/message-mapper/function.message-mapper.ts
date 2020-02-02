
import { BusError } from '../../errors/bus.error';
import { AbstractMessageMapper } from './abstract-message-mapper';

/**
 * Provides the ability to resolve a specific handler for a given message.
 * It is based on the handling collection and uses an extractor to
 * get the identifier of a message and a resolver to instantiate a new handler.
 */
export class FunctionMessageMapper extends AbstractMessageMapper {

  /**
   * @inheritDoc
   */
  getHandlers(message: any): Function[] {
    // Gets the handler based on the message.
    const handlerIdentifier = this._getHandlerIdentifier(message);

    // We expect an array of functions at this time.
    if (!Array.isArray(handlerIdentifier) && typeof handlerIdentifier !== 'function') {
      throw new BusError(`We expect an array or a function. ${typeof handlerIdentifier} given.`);
    }

    // Just returns the array or function.
    return Array.isArray(handlerIdentifier) ? handlerIdentifier : [ handlerIdentifier ];
  }

}
