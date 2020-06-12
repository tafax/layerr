import { MessageMapperInterface, MessageBusMiddlewareInterface } from '@layerr/bus';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { HttpLayerrError, HttpLayerrErrorType } from '../..';
import { HttpExecution } from '../http-execution';

/**
 * Defines the middleware to execute an handler for a given request.
 */
export class RequestHandlerBusMiddleware implements MessageBusMiddlewareInterface {

  constructor(
    protected _messageHandlerMapper: MessageMapperInterface
  ) {}

  /**
   * @inheritDoc
   */
  handle<T>(message: HttpExecution<T>, next: (message: HttpExecution<T>) => Observable<any>): Observable<any> {

    if (!message.hasResponse()) {
      throw new HttpLayerrError(
        `We expect a response at this point!`,
        HttpLayerrErrorType.INTERNAL,
        null,
        null,
        message.request.clone(),
        null,
        null
      );
    }

    // Gets the handler if any.
    const handlers = this._messageHandlerMapper.getHandlers(message.request);

    // We don't have a handler. Just skip to the next middleware.
    if (!handlers || handlers.length === 0) {
      return next(message);
    }

    return handlers[0](message.request, message.response)
      .pipe(
        concatMap((content: T) => next(message.clone({ content })))
      );

  }

}
