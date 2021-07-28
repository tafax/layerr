import { MessageBusMiddlewareInterface, MessageTypeExtractorInterface } from '@layerr/bus';
import { ClassType } from '@layerr/core';
import { Observable, throwError } from 'rxjs';
import { HttpLayerrError } from '../../error/http-layerr.error';
import { HttpLayerrErrorType } from '../../error/http-layerr.error-type';
import { HttpExecution } from '../../http-execution';
import { RequestInterface } from '../../request/request.interface';
import { HttpBackendDecoratorResolver } from './decorator/http-backend.decorator-resolver';

/**
 * Defines a middleware to decide which is the base host given a request decorated
 * with a specific backend.
 */
export class HttpBackendBusMiddleware<T extends string | number> implements MessageBusMiddlewareInterface {

  /**
   * The mapping we want to use between the various backend
   * and the base hosts.
   *
   * Example:
   * enum Backend {
   *   ADMIN_API,
   *   SERVICE_API
   * }
   *
   * The mapping will be:
   * [
   *  [ Backend.ADMIN_API, 'https://api.admin.com' ],
   *  [ Backend.SERVICE_API, 'https://api.service.com' ]
   * ]
   */
  private readonly _map: Map<T, string>;

  constructor(
    mapping: [ T, string ][],
    private readonly _extractor: MessageTypeExtractorInterface,
    private readonly _resolver: HttpBackendDecoratorResolver<T>,
  ) {
    this._map = new Map(mapping);
  }

  /**
   * @inheritDoc
   */
  handle<T>(message: HttpExecution<T>, next: (message: HttpExecution<T>) => Observable<HttpExecution<unknown>>): Observable<HttpExecution<unknown>> {

    // Gets the identifier based on the request object.
    const identifier = this._extractor.extract(message.request);

    // Gets the backend key based on the identifier.
    const httpBackendIdentifier = this._resolver.getValue(identifier as ClassType<RequestInterface>);

    // Reacts if the identifier is present in the mapping.
    if (!this._map.has(httpBackendIdentifier)) {
      return throwError(new HttpLayerrError(
        `Backend key "${httpBackendIdentifier}" doesn't exists.`,
        HttpLayerrErrorType.INTERNAL,
        null,
        null,
        message.request,
        null,
        null,
      ));
    }

    // Gets the mapping and verify it is not undefined.
    const baseHost = this._map.get(httpBackendIdentifier);
    if (!baseHost) {
      return throwError(new HttpLayerrError(
        `Backend key "${httpBackendIdentifier}" points to a not valid base host.`,
        HttpLayerrErrorType.INTERNAL,
        null,
        null,
        message.request,
        null,
        null,
      ));
    }

    // Converts it to a string to make sure it can be used as base host.
    return next(message.clone({ baseHost: `${baseHost}` }));
  }

}
