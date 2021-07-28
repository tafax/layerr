import { Observable, of } from 'rxjs';
import { JsonType } from '../../../core/src/lib/utilities/json-type';
import { RequestHandlerInterface } from '../../src/lib/request-handler/request-handler.interface';
import { RequestInterface } from '../../src/lib/request/request.interface';
import { RemoteResponse } from '../../src/lib/response/remote-response';

export class TestRequestHandler implements RequestHandlerInterface {
  handle(request: RequestInterface, response: RemoteResponse<JsonType>): Observable<RemoteResponse<JsonType>> {
    return of(response);
  }



}
