
import { JsonType } from '@layerr/core';
import { HttpHeaders, HttpHeadersInit } from '../utilities/http-headers';
import { HttpMethod } from '../utilities/http-method';
import { HttpParams, HttpParamsInit } from '../utilities/http-params';
import { HttpResponseContent } from '../utilities/http-response-content';
import { RequestInterface } from './request.interface';

/**
 * Defines the basic type of the request updates.
 */
export interface RequestUpdate {
  method?: HttpMethod;
  withCredentials?: boolean;
  responseType?: HttpResponseContent;
  headers?: HttpHeadersInit;
  query?: HttpParamsInit;
}

/**
 * Defines the basic type for the request initialization.
 */
export declare type RequestInit = RequestUpdate & {
  path: string;
  version: string | null;
}

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

  constructor(init: RequestInit) {
    this._path = init.path;
    this._version = init.version;
    this.method = init.method || HttpMethod.GET;
    this.withCredentials = init.withCredentials || false;
    this.responseType = init.responseType || HttpResponseContent.JSON;
    this._headers = init.headers ? new HttpHeaders(init.headers) : new HttpHeaders();
    this._query = init.query ? new HttpParams(init.query) : new HttpParams();
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
    return this._query.clone();
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
  clone(update?: RequestUpdate): RequestInterface {

    // Clones the object.
    const clone = Object.create(this);

    clone['_headers'] = update ? new HttpHeaders(update.headers || this.getHeaders()) : this.getHeaders();
    clone['_query'] = update ? new HttpParams(update.query || this.getQuery()) : this.getQuery();

    return clone;
  }
}
