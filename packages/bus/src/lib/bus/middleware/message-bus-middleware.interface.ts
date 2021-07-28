import { Observable } from 'rxjs';

/**
 * Base interface to represents middlewares for the bus.
 */
export interface MessageBusMiddlewareInterface {
  /**
   * Handles the message and calls the next middleware in the chain.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle(message: any, next: (message: any) => Observable<any>): Observable<any>;
}
