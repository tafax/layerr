
// Defines a convenience type to describe the message/handlers pair.
import { AbstractCollectionHandlerLookup, MessageHandlerPair } from "./abstract-collection.handler-lookup";

/**
 * Defines a collection of the message/handlers pairs.
 * It just offers a convenience interface to store and retrieve
 * collection objects.
 */
export class ConcurrentCollectionHandlerLookup extends AbstractCollectionHandlerLookup<Function[], Function> {

  /**
   * @inheritDoc
   */
  protected _isHandlerBoundToPair(handler: Function, pair: MessageHandlerPair<Function[]>): boolean {
    return pair.handler.some((value: Function) => value === handler);
  }

}
