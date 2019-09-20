
import { MessageBusMiddlewareInterface } from '@swiss/bus';
import { ClassResolverInterface, LoggerInterface, JsonType } from '@swiss/core';
import { Observable, throwError } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { HttpBusError } from '../errors/http-bus.error';
import { HttpBusErrorType } from '../errors/http-bus.error-type';
import { RemoteCallHandlerInterface } from '../remote-call-handlers/remote-call-handler.interface';
import { RemoteResponse } from '../response/remote-response';
import { HttpExecution } from '../service/http-execution';

export class RemoteCallHandlerBusMiddleware implements MessageBusMiddlewareInterface {

  constructor(
    private _classResolver: ClassResolverInterface,
    private _logger: LoggerInterface
  ) {}

  /**
   * @inheritDoc
   */
  handle(execution: HttpExecution, next: (message: any) => Observable<any>): Observable<any> {

    // Gets the handler if any.
    const handlerClass = execution.options.handler;

    let handler: RemoteCallHandlerInterface;
    if (!!handlerClass) {
      // Gets the handler by resolving the classes.
      handler = this._classResolver.resolve(handlerClass);
    }

    // We should have a handler.
    if (!handler && !!handlerClass) {
      this._logger.error(`Unable to find the handler for ${handlerClass}`);
      return throwError(new HttpBusError(
        `Unable to find the handler for ${handlerClass}`,
        HttpBusErrorType.INTERNAL
      ));
    }

    // We don't have a handler. Just skip to the next middleware.
    if (!handler) {
      return next(execution);
    }

    return handler.handle(execution.remoteCall, execution.response)
      .pipe(
        tap((response: RemoteResponse<JsonType>) => execution.response = response),
        concatMap(() => next(execution))
      );

  }

}
