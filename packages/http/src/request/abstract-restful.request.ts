
import { JsonType } from '@layerr/core';
import { HttpHeaders } from '../utilities/http-headers';
import { HttpMethod } from '../utilities/http-method';
import { HttpParams } from '../utilities/http-params';
import { HttpResponseContent } from '../utilities/http-response-content';
import { RequestInterface } from './request.interface';

/**
 * Defines the abstract restful base request. It provides a common object that should be extended
 * when we need to create a Restful request.
 */
export abstract class AbstractRestfulRequest implements RequestInterface {

  /**
   * @inheritDoc
   */
  method!: HttpMethod;

  /**
   * @inheritDoc
   */
  withCredentials = false;

  /**
   * @inheritDoc
   */
  responseType: HttpResponseContent = HttpResponseContent.JSON;

  constructor(
    private _path: string,
    private _version: string | null
  ) {}

  /**
   * The version of this request.
   */
  get version(): string | null {
    return this._version;
  }

  /**
   * The path for this action.
   */
  get path(): string {
    if (this._version) {
      return `/${this._version!}${this._path}`;
    }
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
  getBody(): JsonType | null {
    return null;
  }

}
