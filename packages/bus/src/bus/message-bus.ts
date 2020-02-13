
import { Observable, of } from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';
import { MessageBusInterface } from './message-bus.interface';
import { MessageBusMiddlewareInterface } from './middleware/message-bus-middleware.interface';

/**
 * A MessageBus that allows to use middlewares.
 */
export class MessageBus<T> implements MessageBusInterface<T> {

  constructor(
    private _middlewares: MessageBusMiddlewareInterface[] = []
  ) {}

  /**
   * @inheritDoc
   */
  get middlewares(): MessageBusMiddlewareInterface[] {
    return this._middlewares;
  }

  /**
   * Creates the function for the next middleware.
   */
  private _functionForNextMiddleware(index: number): (message: any) => Observable<any> {
    if (!this._middlewares[index]) {
      //eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      return (value: any) => of(value);
    }

    const middleware = this._middlewares[index];
    //eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return (message: any) => middleware.handle(message, this._functionForNextMiddleware(index + 1));
  }

  /**
   * @inheritDoc
   */
  appendMiddleware(middleware: MessageBusMiddlewareInterface): void {
    this._middlewares.push(middleware);
  }

  /**
   * @inheritDoc
   */
  prependMiddleware(middleware: MessageBusMiddlewareInterface): void {
    this._middlewares.unshift(middleware);
  }

  /**
   * @inheritDoc
   */
  handle<K>(message: T): Observable<K> {
    // Creates the middleware observables chain.
    const execution$ = this._functionForNextMiddleware(0)(message)
      .pipe(
        /**
         * Makes sure it can be shared between subscriptions.
         * NOTE: shareReplay can't be used here since it shares the last emitted value, but
         * if there is an error it close the internal subscription and the new one
         * will re-execute all the callbacks in the operators so we risk to execute everything twice.
         */
        publishReplay(1),
        refCount()
      );

    // Executes the middlewares chain.
    execution$.subscribe(
      //eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}, // Ignores the next.
      //eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {} // Ignores the errors to avoid logging unexpected errors.
    );

    return execution$;
  }

}
