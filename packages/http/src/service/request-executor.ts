
import { MessageBus } from '@layerr/bus';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpExecution } from '../http-execution';
import { RequestInterface } from '../request/request.interface';

/**
 * Defines a request executor to translate a request
 * into an HTTP execution to send to the bus.
 */
export class RequestExecutor {

  /**
   * The message bus to use to process an execution.
   */
  private _messageBus: MessageBus<HttpExecution<any>>

  /**
   * The base host if we want to override it.
   */
  private _baseHost!: string;

  /**
   * The retry attempt if we want to override it.
   */
  private _retryAttemptCount: number | null;

  /**
   * The retry delay if we want to override it.
   */
  private _retryDelay!: number;

  /**
   * The timeout if we want to override it.
   */
  private _timeout!: number;

  constructor(
    baseHost: string,
    retryAttemptCount: number | null,
    retryDelay: number,
    timeout: number,
    messageBus: MessageBus<HttpExecution<any>>
  ) {
    this._baseHost = baseHost;
    this._retryAttemptCount = retryAttemptCount;
    this._retryDelay = retryDelay;
    this._timeout = timeout;
    this._messageBus = messageBus;
  }

  /**
   * Executes a request and provides a remote response.
   */
  execute<T>(request: RequestInterface): Observable<T | undefined> {

    // Creates the execution object to send to the bus.
    const execution = new HttpExecution<T>({
      request: request.clone(),
      baseHost: this._baseHost,
      retryAttemptCount: this._retryAttemptCount,
      retryDelay: this._retryDelay,
      timeout: this._timeout
    });

    return this._messageBus.handle<HttpExecution<T>>(execution)
      .pipe(
        map((execution: HttpExecution<T>) => execution.content)
      );
  }

}
