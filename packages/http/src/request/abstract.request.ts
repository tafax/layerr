
import { JsonType } from '@layerr/core';
import { HttpHeaders } from '../utilities/http-headers';
import { HttpMethod } from '../utilities/http-method';
import { HttpParams } from '../utilities/http-params';
import { HttpResponseContent } from '../utilities/http-response-content';
import { RequestInterface } from './request.interface';

/**
 * Defines the abstract base request. It provides a common object that should be extended
 * when we need to create a request.
 */
export abstract class AbstractRequest implements RequestInterface {

  /**
   * The path of the request.
   */
  private _path: string;

  /**
   * The version of the endpoint we want to use.
   */
  private _version: string | null;

  /**
   * The headers of the request.
   */
  private _headers: HttpHeaders = new HttpHeaders();

  /**
   * The query of the request.
   */
  private _query: HttpParams = new HttpParams();

  /**
   * @inheritDoc
   */
  readonly method: HttpMethod = HttpMethod.GET;

  /**
   * @inheritDoc
   */
  readonly withCredentials: boolean = false;

  /**
   * @inheritDoc
   */
  readonly responseType: HttpResponseContent = HttpResponseContent.JSON;

  constructor(init: {
    path: string;
    version: string | null;
    method?: HttpMethod;
    withCredentials?: boolean;
    responseType?: HttpResponseContent;
    headers?: HttpHeaders;
    query?: HttpParams;
  }) {
    this._path = init.path;
    this._version = init.version;
    this.method = init.method || HttpMethod.GET;
    this.withCredentials = init.withCredentials || false;
    this.responseType = init.responseType || HttpResponseContent.JSON;
    this._headers = init.headers || new HttpHeaders();
    this._query = init.query || new HttpParams();
  }

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
    return this._headers.clone();
  }

  /**
   * @inheritDoc
   */
  getQuery(): HttpParams {
    return this._query;
  }

  /**
   * @inheritDoc
   */
  getBody(): JsonType | null {
    return null;
  }

  /**
   * @inheritDoc
   */
  clone(update?: {
    method?: HttpMethod;
    withCredentials?: boolean;
    responseType?: HttpResponseContent;
    headers?: HttpHeaders;
    query?: HttpParams;
  }): RequestInterface {
    if (!update) {
      return Reflect.construct(this.constructor, [ {
        path: this._path,
        version: this._version,
        method: this.method,
        withCredentials: this.withCredentials,
        responseType: this.responseType,
        headers: this._headers,
        query: this._query,
      } ]);
    }

    return Reflect.construct(this.constructor, [ {
      path: this._path,
      version: this._version,
      method: update.method || this.method,
      withCredentials: update.withCredentials || this.withCredentials,
      responseType: update.responseType || this.responseType,
      headers: update.headers || this._headers,
      query: update.query || this._query,
    } ]);
  }
}
