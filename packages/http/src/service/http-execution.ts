
import { JsonType } from '@swiss/core';
import { RemoteCallOptions } from '../decorators/configurations/remote-call.options';
import { RemoteCallInterface } from '../remote-call/remote-call.interface';
import { RemoteResponse } from '../response/remote-response';

/**
 * The http execution object that describes the run.
 */
export class HttpExecution {

  /**
   * The remote call to execute.
   */
  remoteCall: RemoteCallInterface;

  /**
   * The response we got.
   */
  response: RemoteResponse<JsonType>;

  /**
   * The final result of the execution.
   */
  result: any;

  /**
   * The options extracted from the remote call.
   */
  options: RemoteCallOptions<any>;

  /**
   * The base host if we want to override it.
   */
  baseHost: string;

  /**
   * The retry attempt if we want to override it.
   */
  retryAttemptCount: number;

  /**
   * The retry delay if we want to override it.
   */
  retryDelay: number;

  /**
   * The timeout if we want to override it.
   */
  timeout: number;

}
