import { JsonType } from '@layerr/core';
import { HttpHeaders, HttpHeadersInit } from '../utilities/http-headers';
import { HttpMethod } from '../utilities/http-method';
import { HttpParams, HttpParamsInit } from '../utilities/http-params';
import { HttpRequestContent } from '../utilities/http-request-content';
import { HttpResponseContent } from '../utilities/http-response-content';

/**
 * Defines the basic type of the request updates
 */
export interface RequestUpdate {
  path?: string;
  rawPath?: string;
  method?: HttpMethod;
  withCredentials?: boolean;
  contentType?: HttpRequestContent;
  responseType?: HttpResponseContent;
  headers?: HttpHeadersInit;
  query?: HttpParamsInit;
}

/**
 * Defines the interface for the actions
 * It exposes the needed properties to create a request
 * Each class that implements the interface should provide
 * this info in order to allow the bus to create the correct request
 */
export interface RequestInterface {

  /**
   * The version to the endpoint
   */
  version: string | null;

  /**
   * The path to the endpoint
   */
  path: string;

  /**
   * The HTTP method of the request
   */
  method: HttpMethod;

  /**
   * A flag that tells if the credentials should be sent over the CORS
   */
  withCredentials: boolean;

  /**
   * The request content type to use
   */
  contentType: HttpRequestContent;

  /**
   * The declared response type
   */
  responseType: HttpResponseContent;

  /**
   * The headers of the request
   */
  getHeaders(): HttpHeaders;

  /**
   * The query parameters of the request
   */
  getQuery(): HttpParams;

  /**
   * The body of the request
   */
  getBody(): JsonType | null;

  /**
   * Clones the current request
   */
  clone(update?: RequestUpdate): RequestInterface;
}
