
import { JsonType } from '@layerr/core';
import { RequestInterface } from './request/request.interface';
import { RemoteResponse } from './response/remote-response';

/**
 * The http execution object that describes the run.
 */
export class HttpExecution<T> {

  /**
   * The request to execute.
   */
  readonly request: RequestInterface;

  /**
   * The response we got.
   */
  readonly response?: RemoteResponse<JsonType>;

  /**
   * This is the parsed version of the response body.
   */
  readonly content?: T;

  /**
   * The base host if we want to override it.
   */
  readonly baseHost: string;

  /**
   * The retry attempt if we want to override it.
   */
  readonly retryAttemptCount: number | null;

  /**
   * The retry delay if we want to override it.
   */
  readonly retryDelay: number;

  /**
   * The timeout if we want to override it.
   */
  readonly timeout: number;

  constructor(init: {
    request: RequestInterface;
    baseHost: string;
    retryAttemptCount: number | null;
    retryDelay: number;
    timeout: number;
    response?: RemoteResponse<JsonType>;
    content?: T;
  }) {
    this.request = init.request;
    this.baseHost = init.baseHost;
    this.retryAttemptCount = init.retryAttemptCount;
    this.retryDelay = init.retryDelay;
    this.timeout = init.timeout;
    this.response = init.response || undefined;
    this.content = init.content || undefined;
  }

  /**
   * Returns true if the response is set.
   */
  hasResponse(): boolean {
    return !!this.response;
  }

  /**
   * Returns true if the response is set.
   */
  hasContent(): boolean {
    return !!this.content;
  }

  /**
   * Clones this object to make it immutable.
   */
  clone(update?: {
    baseHost?: string;
    request?: RequestInterface;
    response?: RemoteResponse<JsonType>;
    content?: T | null;
  }): HttpExecution<T> {

    if (!update) {
      return new HttpExecution<T>({
        request: this.request,
        baseHost: this.baseHost,
        retryAttemptCount: this.retryAttemptCount,
        retryDelay: this.retryDelay,
        timeout: this.timeout,
        response: this.response,
        content: this.content
      })
    }

    return new HttpExecution<T>({
      request: update.request || this.request,
      baseHost: update.baseHost || this.baseHost,
      retryAttemptCount: this.retryAttemptCount,
      retryDelay: this.retryDelay,
      timeout: this.timeout,
      response: update.response || this.response,
      content: update.content || this.content
    });
  }

}
