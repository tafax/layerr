import { AbstractCollectionHandlerLookup, MessageHandlerPair } from "./abstract-collection.handler-lookup";

/**
 * Defines a collection of the message/handlers pairs.
 * It just offers a convenience interface to store and retrieve
 * collection objects.
 */
//eslint-disable-next-line @typescript-eslint/ban-types
export class ConcurrentCollectionHandlerLookup extends AbstractCollectionHandlerLookup<Function[], Function> {
  /**
   * @inheritDoc
   */
  //eslint-disable-next-line @typescript-eslint/ban-types
  protected _isHandlerBoundToPair(handler: Function, pair: MessageHandlerPair<Function[]>): boolean {
    //eslint-disable-next-line @typescript-eslint/ban-types
    return pair.handler.some((value: Function) => value === handler);
  }
}
