
import { JsonType } from '@layerr/core';
import { Observable, of } from 'rxjs';
import { RequestHandlerInterface } from '../../src/request-handler/request-handler.interface';
import { RequestInterface } from '../../src/request/request.interface';
import { RemoteResponse } from '../../src/response/remote-response';

export class TestRequestHandler implements RequestHandlerInterface {
  handle(_request: RequestInterface, response: RemoteResponse<JsonType>): Observable<RemoteResponse<JsonType>> {
    return of(response);
  }



}
