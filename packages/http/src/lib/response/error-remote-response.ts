// istanbul ignore file

import { HttpHeaders } from '../utilities/http-headers';
import { RemoteResponse } from './remote-response';

/**
 * Defines the error remote response.
 */
export class ErrorRemoteResponse<T> extends RemoteResponse<T> implements Error {

  /**
   * The name of the error.
   */
  public readonly name = "ErrorRemoteResponse";

  /**
   * The message of the error.
   */
  public readonly message: string;

  /**
   * The base error if any.
   */
  public readonly error: Error | null;

  constructor(
    message: string,
    error: Error | null,
    body: T | null,
    headers: HttpHeaders,
    status: number,
    statusText: string,
    url: string,
  ) {
    super(
      body,
      headers,
      status,
      statusText,
      url,
    );

    this.message = message;
    this.error = error;
  }
}
