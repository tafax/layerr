
import { MessageBusMiddlewareInterface } from '@swiss/bus';
import { LoggerInterface } from '@swiss/core';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpBusError } from '../errors/http-bus.error';
import { HttpBusErrorType } from '../errors/http-bus.error-type';
import { ErrorRemoteResponse } from '../response/error-remote-response';
import { HttpExecution } from '../service/http-execution';

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
  handle(execution: HttpExecution, next: (execution: HttpExecution) => Observable<any>): Observable<any> {
    return next(execution)
      .pipe(
        catchError((error: Error) => {

          let rethrownError = error;

          if (error instanceof TimeoutError) {
            this._logger.error(`TimeoutError: ${error.message} - RemoteCall: ${execution.remoteCall.path}`);
            rethrownError = new HttpBusError(
              error.message,
              HttpBusErrorType.TIMEOUT,
              -1,
              'Timeout',
              execution.remoteCall
            );
          }

          if (error instanceof ErrorRemoteResponse) {

            const isUnknown = !error.status || error.status === 0;

            if (isUnknown) {
              this._logger.error(`Unknown error: ${error.message} - RemoteCall: ${execution.remoteCall.path}`);
              rethrownError = new HttpBusError(
                `No status code - Unknown error [ ${error.statusText} - ${error.message} ]`,
                HttpBusErrorType.UNKNOWN,
                0,
                error.statusText,
                execution.remoteCall,
                error
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

              this._logger.error(`Error: ${error.status} ${error.statusText} ${error.message} - RemoteCall: ${execution.remoteCall.path}`);
              rethrownError = new HttpBusError(
                `${error.statusText ? error.statusText : 'Generic error'} - ${error.message ? error.message : 'Server error'}`,
                type,
                error.status,
                error.statusText,
                execution.remoteCall,
                error,
                // The error content.
                error.error
              );
            }
          }

          return throwError(rethrownError);
        })
      );
  }

}
