
import { Observable } from 'rxjs';
import { MessageBusMiddlewareInterface } from './middleware/message-bus-middleware.interface';

/**
 * Base interface to describe a MessageBus object.
 */
export interface MessageBusInterface<T> {

  /**
   * Gets the middlewares added to the bus.
   */
  readonly middlewares: MessageBusMiddlewareInterface[];

  /**
   * Appends a new middleware.
   */
  appendMiddleware(middleware: MessageBusMiddlewareInterface);

  /**
   * Prepends a new middleware.
   */
  prependMiddleware(middleware: MessageBusMiddlewareInterface);

  /**
   * Handles the message passed to the bus.
   */
  handle<U>(message: T): Observable<U>;

}
