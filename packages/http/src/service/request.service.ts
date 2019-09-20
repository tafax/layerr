
import { MessageBusInterface, MessageBusMiddlewareInterface } from '@swiss/bus';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoteCallInterface } from '../remote-call/remote-call.interface';
import { HttpExecution } from './http-execution';

/**
 * Defines the http bus. It is the main service to use
 * in order to create, format, execute and handle the HTTP requests.
 *
 * - It creates an HTTP request based on the given action.
 * - It runs the side effects to extend the request. If any.
 * - It executes the HTTP request over the net.
 * - It runs the side effects to extend the response. If any.
 * - It resolves the handler for the given action.
 * - It handles the action with the resolved handler passing the response.
 * - It returns the model or models set given by the handler.
 */
export class RequestService {

  /**
   * The base host used to perform the requests.
   */
  private _baseHost: string = '';

  /**
   * The client side timeout for the net calls.
   * By default it is set to 10sec. Use a negative value to disable it.
   */
  private _timeout = 10000;

  /**
   * The time interval between two consecutive attempts. The time is expressed in milliseconds. Default 0,5 sec.
   */
  private _retryDelay = 500;

  /**
   * The number of attempts to re-execute after a http request failed. The attempts are executed only for
   * a request which failed with status code zero. A response can have zero as status code in the following cases:
   * - lack of internet connection
   * - the related OPTIONS request failed due to CORS
   */
  private _retryAttemptCount: number;

  constructor(
    private _executionBus: MessageBusInterface<HttpExecution>
  ) {}

  /**
   * Gets the base host to perform the requests.
   */
  get baseHost(): string {
    return this._baseHost;
  }

  /**
   * Sets the base host.
   */
  set baseHost(value: string) {
    this._baseHost = value;
  }

  /**
   * Gets the timeout for the net calls.
   */
  get timeout(): number {
    return this._timeout;
  }

  /**
   * The number of attempts to re-execute a failing http request.
   */
  get retryAttemptCount(): number {
    return this._retryAttemptCount;
  }

  /**
   * The time interval between two consecutive attempts. The time is expressed in milliseconds. Default 0,5 sec.
   */
  get retryDelay(): number {
    return this._retryDelay;
  }

  /**
   * Sets the number of attempts.
   */
  set retryAttemptCount(value: number) {
    this._retryAttemptCount = value;
  }

  /**
   * Sets the time interval between two consecutive attempts.
   */
  set retryDelay(value: number) {
    this._retryDelay = value;
  }

  /**
   * Sets the timeout value.
   */
  set timeout(value: number) {
    this._timeout = value;
  }

  /**
   * Uses the middleware.
   */
  useMiddleware(middleware: MessageBusMiddlewareInterface) {
    this._executionBus.appendMiddleware(middleware);
  }

  /**
   * Executes a remote call.
   * @param remoteCall The call to execute.
   * @returns Observable object that return a model or models set.
   */
  execute<T>(remoteCall: RemoteCallInterface): Observable<T | T[]> {

    // Prepare the execution.
    const execution = new HttpExecution();
    execution.baseHost = this._baseHost;
    execution.retryAttemptCount = this._retryAttemptCount;
    execution.retryDelay = this._retryDelay;
    execution.timeout = this._timeout;
    execution.remoteCall = remoteCall;

    return this._executionBus.handle(execution)
      .pipe(
        map((resultExecution: HttpExecution) => resultExecution.result || resultExecution.response)
      );
  }

}
