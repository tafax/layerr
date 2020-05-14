
import { MessageBus } from '@layerr/bus';
import { JsonType } from '@layerr/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpExecution } from '../http-execution';
import { RequestInterface } from '../request/request.interface';
import { RemoteResponse } from '../response/remote-response';

/**
 * Defines a request executor to translate a request
 * into an HTTP execution to send to the bus.
 */
export class RequestExecutor {

  /**
   * The message bus to use to process an execution.
   */
  private _messageBus: MessageBus<HttpExecution>

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
    messageBus: MessageBus<HttpExecution>
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
  execute(request: RequestInterface): Observable<RemoteResponse<JsonType>> {
    const execution = new HttpExecution();
    execution.request = request;
    execution.baseHost = this._baseHost;
    execution.retryAttemptCount = this._retryAttemptCount;
    execution.retryDelay = this._retryDelay;
    execution.timeout = this._timeout;

    return this._messageBus.handle<HttpExecution>(execution)
      .pipe(
        map((execution: HttpExecution) => execution.response)
      );
  }

}
