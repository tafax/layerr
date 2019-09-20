
import { HttpHeaders } from '../utilities/http-headers';
import { RemoteResponse } from './remote-response';

export class ErrorRemoteResponse<T> extends RemoteResponse<T> implements Error {

  readonly name = "ErrorRemoteResponse";

  readonly message: string;

  readonly error: any | null;

  constructor(
    message: string,
    error: any = null,
    body?: T | null,
    headers?: HttpHeaders,
    status?: number,
    statusText?: string,
    url?: string
  ) {
    super(
      body,
      headers,
      status,
      statusText,
      url
    );

    this.message = message;
    this.error = error;
  }

}
