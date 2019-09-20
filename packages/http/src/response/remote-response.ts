
import { HttpHeaders } from '../utilities/http-headers';

export class RemoteResponse<T> {

  readonly headers: HttpHeaders;

  readonly status: number;

  readonly statusText: string;

  readonly url: string;

  /**
   * The response body, or `null` if one was not returned.
   */
  private _body: T | null;

  constructor(
    body?: T | null,
    headers?: HttpHeaders,
    status?: number,
    statusText?: string,
    url?: string
  ) {
    this._body = body;
    this.headers = headers;
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }

  set body(value: T) {
    this._body = value;
  }

  get body(): T {
    return this._body;
  }

}
