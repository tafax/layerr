
import { HttpHeaders } from '../utilities/http-headers';

/**
 * Defines the remote response.
 */
export class RemoteResponse<T> {

  /**
   * The headers of the responses.
   */
  readonly headers: HttpHeaders;

  /**
   * The status of the response.
   */
  readonly status: number;

  /**
   * The status text of the response.
   */
  readonly statusText: string;

  /**
   * The URL of the request that generated this response.
   */
  readonly url: string;

  /**
   * The response body, or `null` if one was not returned.
   */
  readonly body: T | null;

  constructor(
    body: T | null,
    headers: HttpHeaders,
    status: number,
    statusText: string,
    url: string
  ) {
    this.body = body;
    this.headers = headers;
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }

  /**
   * Tells if this response has a body.
   */
  hasBody(): boolean {
    return this.body !== null;
  }

}
