import { from, Observable, of } from 'rxjs';
import { concatMap, map, toArray, flatMap, filter, defaultIfEmpty } from 'rxjs/operators';
import { MessageBusMiddlewareInterface } from '../bus/middleware/message-bus-middleware.interface';
import { MessageMapperInterface } from './message-mapper/message-mapper.interface';

/**
 * Allows to handle a message using a specific handler function.
 *
 * Its purpose is to provide the ability to handle the message and
 * propagate the message itself to the next middleware. It doesn't handle
 * errors.
 */
export class MessageHandlerMiddleware implements MessageBusMiddlewareInterface {
  constructor(
    protected _messageHandlerMapper: MessageMapperInterface,
  ) {}

  /**
   * Wraps up a value with an observable. If needed.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static WrapWithObservable(value: any): Observable<any> {
    if (value instanceof Observable) {
      return value;
    }

    if (value instanceof Promise) {
      return from(value);
    }

    return of(value);
  }

  /**
   * @inheritDoc
   */
  handle(message: unknown, next: (message: unknown) => Observable<unknown>): Observable<unknown> {
    // It wraps the message with an observable.
    return MessageHandlerMiddleware.WrapWithObservable(message)
      .pipe(
        /**
         * Resolves the set of handlers based on the specified resolver.
         * Wraps the handlers into an observable to be sure to respect the chain.
         */
        map((currentMessage: unknown) => this._messageHandlerMapper.getHandlers(currentMessage)),
        filter((handlers: ((message: unknown) => unknown)[]) => !!handlers && handlers.length > 0),
        concatMap((handlers: ((message: unknown) => unknown)[]) => from(handlers)
          .pipe(
            flatMap((handler: (message: unknown) => unknown) => MessageHandlerMiddleware.WrapWithObservable(handler(message))),
            toArray(),
          ),
        ),
        defaultIfEmpty(message),
        concatMap(
          (result: unknown) => next(result),
        ),
      );
  }
}
