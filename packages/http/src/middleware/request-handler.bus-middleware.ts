
import { MessageMapperInterface, MessageBusMiddlewareInterface } from '@layerr/bus';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { HttpExecution } from '../http-execution';
import { RemoteResponse } from '../response/remote-response';
import { JsonType } from '@layerr/core';

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
  handle(message: HttpExecution, next: (message: HttpExecution) => Observable<any>): Observable<any> {

    // Gets the handler if any.
    const handlers = this._messageHandlerMapper.getHandlers(message.request);

    // We don't have a handler. Just skip to the next middleware.
    if (!handlers || handlers.length === 0) {
      return next(message);
    }

    return handlers[0](message.request, message.response)
      .pipe(
        concatMap((response: RemoteResponse<JsonType>) => {
          message.response = response;
          return next(message);
        })
      );

  }

}
