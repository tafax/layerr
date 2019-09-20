
import { JsonType } from '@swiss/core';
import { RemoteCallInterface } from '../remote-call/remote-call.interface';
import { HttpBusErrorType } from './http-bus.error-type';

/**
 * Basic error thrown when an error occurs.
 */
export class HttpBusError extends Error {

  constructor(
    _message: string,
    private _type: HttpBusErrorType,
    private _status?: number,
    private _statusText?: string,
    private _remoteCall?: RemoteCallInterface,
    private _original?: Error,
    private _errorContent?: JsonType
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
  get status(): number {
    return this._status;
  }

  /**
   * Gets the status text.
   */
  get statusText(): string {
    return this._statusText;
  }

  /**
   * Gets the content of the error.
   */
  get errorContent(): JsonType {
    return this._errorContent;
  }

  /**
   * Gets the request.
   */
  get remoteCall(): RemoteCallInterface {
    return this._remoteCall;
  }

  /**
   * Gets the original error.
   */
  get original(): Error {
    return this._original;
  }
}
