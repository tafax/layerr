

// Defines a convenience type to describe the message/handler pair.
import { AbstractCollectionHandlerLookup, MessageHandlerPair } from "./abstract-collection.handler-lookup";

/**
 * Defines a collection of the message/handler pairs.
 * It just offers a convenience interface to store and retrieve
 * collection objects.
 */
export class CollectionHandlerLookup extends AbstractCollectionHandlerLookup<any> {

  /**
   * @inheritDoc
   */
  protected _isHandlerBoundToPair(handler: any, pair: MessageHandlerPair<any>): boolean {
    return pair.handler === handler;
  }

}
