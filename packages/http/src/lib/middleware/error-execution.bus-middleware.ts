
import { MessageBusMiddlewareInterface } from '@layerr/bus';
import { LoggerInterface } from '@layerr/core';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpLayerrError } from '../error/http-layerr.error';
import { HttpLayerrErrorType } from '../error/http-layerr.error-type';
import { HttpExecution } from '../http-execution';
import { ErrorRemoteResponse } from '../response/error-remote-response';

/**
 * Defines the error middleware to handle the error in the execution bus.
 */
export class ErrorExecutionBusMiddleware implements MessageBusMiddlewareInterface {
  constructor(
    private readonly _logger: LoggerInterface,
  ) {}

  /**
   * @inheritDoc
   */
  handle<T>(message: HttpExecution<T>, next: (message: HttpExecution<T>) => Observable<unknown>): Observable<unknown> {
    return next(message)
      .pipe(
        catchError((error: Error) => {

          let rethrownError = error;

          if (error instanceof TimeoutError) {
            this._logger.error(`TimeoutError: ${error.message} - Request: ${message.request.path}`);
            rethrownError = new HttpLayerrError(
              error.message,
              HttpLayerrErrorType.TIMEOUT,
              -1,
              'Timeout',
              message.request,
              null,
              null,
            );
          }

          if (error instanceof ErrorRemoteResponse) {

            const isUnknown = !error.status || error.status === 0;

            if (isUnknown) {
              this._logger.error(`Unknown error: ${error.message} - Request: ${message.request.path}`);
              rethrownError = new HttpLayerrError(
                `No status code - Unknown error [ ${error.statusText} - ${error.message} ]`,
                HttpLayerrErrorType.UNKNOWN,
                0,
                error.statusText,
                message.request,
                error,
                null,
              );
            } else {

              let type;
              switch (error.status) {
                case 400:
                  type = HttpLayerrErrorType.MALFORMED;
                  break;
                case 401:
                  type = HttpLayerrErrorType.UNAUTHENTICATED;
                  break;
                case 403:
                  type = HttpLayerrErrorType.FORBIDDEN;
                  break;
                case 404:
                  type = HttpLayerrErrorType.NOT_FOUND;
                  break;
                default:
                  type = HttpLayerrErrorType.UNEXPECTED;
              }

              this._logger.error(`Error: ${error.status} ${error.statusText} ${error.message} - Request: ${message.request.path}`);
              rethrownError = new HttpLayerrError(
                `${error.statusText ? error.statusText : 'Generic error'} - ${error.message}`,
                type,
                error.status,
                error.statusText,
                message.request,
                error,
                // The error content.
                error.body,
              );
            }
          }

          return throwError(rethrownError);
        }),
      );
  }
}
