
import { JsonType } from '@swiss/core';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, delay, flatMap, retryWhen, timeout } from 'rxjs/operators';
import { RemoteCallInterface } from '../../remote-call/remote-call.interface';
import { RemoteResponse } from '../../response/remote-response';
import { HttpAdapterInterface } from '../adapter/http-adapter.interface';
import { HttpExecution } from '../http-execution';
import { HttpExecutorInterface } from './http-executor.interface';

/**
 * Defines the default request executor.
 */
export class DefaultHttpExecutor implements HttpExecutorInterface<JsonType> {

  /**
   * @inheritDoc
   */
  execute(execution: HttpExecution, httpAdapter: HttpAdapterInterface): Observable<RemoteResponse<JsonType>> {
    // Starts by streaming the request.
    return of(execution.remoteCall)
      .pipe(
        // Prepares the HTTP request based on the given request object.
        flatMap(
          (remoteCall: RemoteCallInterface) => {
            // Gets the request stream.
            let request$ = httpAdapter.execute<JsonType>(remoteCall);
            if (Number.isFinite(execution.retryAttemptCount) && execution.retryAttemptCount > 0) {
              request$ = request$
                .pipe(
                  retryWhen((notifiers: Observable<RemoteResponse<JsonType>>) => notifiers
                    .pipe(
                      concatMap((response: RemoteResponse<JsonType>, index: number) => {
                        // If the all the attempts has been tried or the request is not failed with status code zero forward the error...
                        if ((!response || response.status !== 0) || index > execution.retryAttemptCount) {
                          return throwError(response);
                        }
                        // ...otherwise execute the next attempt after a specified amount of time.
                        return of(response)
                          .pipe(
                            delay(execution.retryDelay)
                          );
                      }))
                  )
                );
            }

            // Sets the timeout if needed.
            if (execution.timeout > 0) {
              request$ = request$
                .pipe(
                  timeout(execution.timeout)
                );
            }
            // Otherwise, simply returns the stream.
            return request$;
          }
        )
      );
  }

}
