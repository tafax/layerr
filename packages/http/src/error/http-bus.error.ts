
/* istanbul ignore file */

import { RequestInterface } from '../request/request.interface';
import { HttpBusErrorType } from './http-bus.error-type';

/**
 * Basic error thrown when an error occurs.
 */
export class HttpBusError extends Error {

  constructor(
    _message: string,
    private _type: HttpBusErrorType,
    private _status: number | null,
    private _statusText: string | null,
    private _request: RequestInterface | null,
    private _original: Error | null,
    private _errorContent: any | null
  ) {
    super(_message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpBusError.prototype);
  }

  /**
   * Gets the type of the error.
   */
  get type(): HttpBusErrorType {
    return this._type;
  }

  /**
   * Gets the status code.
   */
  get status(): number | null {
    return this._status;
  }

  /**
   * Gets the status text.
   */
  get statusText(): string | null {
    return this._statusText;
  }

  /**
   * Gets the content of the error.
   */
  get errorContent(): any | null {
    return this._errorContent;
  }

  /**
   * Gets the request.
   */
  get request(): RequestInterface | null {
    return this._request;
  }

  /**
   * Gets the original error.
   */
  get original(): Error | null {
    return this._original;
  }
}
