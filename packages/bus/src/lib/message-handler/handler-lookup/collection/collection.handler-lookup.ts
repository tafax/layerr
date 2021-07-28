import { AbstractCollectionHandlerLookup, MessageHandlerPair } from "./abstract-collection.handler-lookup";

/**
 * Defines a collection of the message/handler pairs.
 * It just offers a convenience interface to store and retrieve
 * collection objects.
 */
export class CollectionHandlerLookup extends AbstractCollectionHandlerLookup<unknown> {
  /**
   * @inheritDoc
   */
  protected _isHandlerBoundToPair(handler: unknown, pair: MessageHandlerPair): boolean {
    return pair.handler === handler;
  }
}
