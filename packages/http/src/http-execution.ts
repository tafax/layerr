
import { JsonType } from '@layerr/core';
import { RequestInterface } from './request/request.interface';
import { RemoteResponse } from './response/remote-response';

/**
 * The http execution object that describes the run.
 */
export class HttpExecution {

  /**
   * The request to execute.
   */
  request!: RequestInterface;

  /**
   * The response we got.
   */
  response!: RemoteResponse<JsonType>;

  /**
   * The final result of the execution.
   */
  result: any;

  /**
   * The base host if we want to override it.
   */
  baseHost!: string;

  /**
   * The retry attempt if we want to override it.
   */
  retryAttemptCount: number | undefined;

  /**
   * The retry delay if we want to override it.
   */
  retryDelay!: number;

  /**
   * The timeout if we want to override it.
   */
  timeout!: number;

}
