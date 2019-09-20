
import { JsonType } from '@swiss/core';
import { HttpHeaders } from '../utilities/http-headers';
import { HttpMethod } from '../utilities/http-method';
import { HttpParams } from '../utilities/http-params';
import { HttpResponseContent } from '../utilities/http-response-content';
import { RemoteCallInterface } from './remote-call.interface';

/**
 * Defines the abstract restful base request. It provides a common object that should be extended
 * when we need to create a Restful request.
 */
export abstract class AbstractRestfulRemoteCall implements RemoteCallInterface {

  /**
   * @inheritDoc
   */
  method: HttpMethod;

  /**
   * @inheritDoc
   */
  withCredentials: boolean = false;

  /**
   * @inheritDoc
   */
  responseType: HttpResponseContent;

  constructor(
    private _path: string
  ) {}

  /**
   * The path for this action.
   */
  get path(): string {
    return this._path;
  }

  /**
   * @inheritDoc
   */
  getHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  /**
   * @inheritDoc
   */
  getQuery(): HttpParams {
    return new HttpParams();
  }

  /**
   * @inheritDoc
   */
  getBody(): JsonType {
    return null;
  }

}
