
import { MessageBusMiddlewareInterface } from '@layerr/bus';
import { LoggerInterface } from '@layerr/core';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpBusError } from '../error/http-bus.error';
import { HttpBusErrorType } from '../error/http-bus.error-type';
import { HttpExecution } from '../http-execution';
import { ErrorRemoteResponse } from '../response/error-remote-response';

/**
 * Defines the error middleware to handle the error in the execution bus.
 */
export class ErrorExecutionBusMiddleware implements MessageBusMiddlewareInterface {

  constructor(
    private _logger: LoggerInterface
  ) {}

  /**
   * @inheritDoc
   */
  handle(message: HttpExecution, next: (message: HttpExecution) => Observable<any>): Observable<any> {
    return next(message)
      .pipe(
        catchError((error: Error) => {

          let rethrownError = error;

          if (error instanceof TimeoutError) {
            this._logger.error(`TimeoutError: ${error.message} - RemoteCall: ${message.request.path}`);
            rethrownError = new HttpBusError(
              error.message,
              HttpBusErrorType.TIMEOUT,
              -1,
              'Timeout',
              message.request,
              null,
              null
            );
          }

          if (error instanceof ErrorRemoteResponse) {

            const isUnknown = !error.status || error.status === 0;

            if (isUnknown) {
              this._logger.error(`Unknown error: ${error.message} - RemoteCall: ${message.request.path}`);
              rethrownError = new HttpBusError(
                `No status code - Unknown error [ ${error.statusText} - ${error.message} ]`,
                HttpBusErrorType.UNKNOWN,
                0,
                error.statusText,
                message.request,
                error,
                null
              );
            } else {

              let type;
              switch (error.status) {
                case 400:
                  type = HttpBusErrorType.MALFORMED;
                  break;
                case 401:
                  type = HttpBusErrorType.UNAUTHENTICATED;
                  break;
                case 403:
                  type = HttpBusErrorType.FORBIDDEN;
                  break;
                case 404:
                  type = HttpBusErrorType.NOT_FOUND;
                  break;
                default:
                  type = HttpBusErrorType.UNEXPECTED;
              }

              this._logger.error(`Error: ${error.status} ${error.statusText} ${error.message} - RemoteCall: ${message.request.path}`);
              rethrownError = new HttpBusError(
                `${error.statusText ? error.statusText : 'Generic error'} - ${error.message}`,
                type,
                error.status,
                error.statusText,
                message.request,
                error,
                // The error content.
                error.body
              );
            }
          }

          return throwError(rethrownError);
        })
      );
  }

}
