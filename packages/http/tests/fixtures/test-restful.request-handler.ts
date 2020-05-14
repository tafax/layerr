
import { JsonType } from '@layerr/core';
import { Observable, of } from 'rxjs';
import { RequestInterface } from '../..';
import { RequestHandlerInterface } from '../../src/request-handler/request-handler.interface';
import { RemoteResponse } from '../../src/response/remote-response';

export class TestRestfulRequestHandler implements RequestHandlerInterface {
  handle(_remoteCall: RequestInterface, response: RemoteResponse<JsonType>): Observable<RemoteResponse<JsonType>> {
    return of(response);
  }



}
