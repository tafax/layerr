
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
    protected _messageHandlerMapper: MessageMapperInterface
  ) {}

  /**
   * Wraps up a value with an observable. If needed.
   */
  private _wrapWithObservable(value: any): Observable<any> {
    if (value instanceof Observable) {
      return value;
    }

    if (value instanceof Promise) {
      return from(value as Promise<any>);
    }

    return of(value);
  }

  /**
   * @inheritDoc
   */
  handle(message: any, next: (message: any) => Observable<any>): Observable<any> {
    // It wraps the message with an observable.
    return this._wrapWithObservable(message)
      .pipe(
        /**
         * Resolves the set of handlers based on the specified resolver.
         * Wraps the handlers into an observable to be sure to respect the chain.
         */
        map((currentMessage: any) => this._messageHandlerMapper.getHandlers(currentMessage)),
        filter((handlers: ((message: any) => any)[]) => !!handlers || handlers.length > 0),
        concatMap((handlers: ((message: any) => any)[]) => from(handlers)
          .pipe(
            flatMap((handler: (message: any) => any) => this._wrapWithObservable(handler(message))),
            toArray()
          )
        ),
        defaultIfEmpty(message),
        concatMap(
          (result: any) => next(result)
        )
      );
  }
}
