
import { JsonType } from '@swiss/core';
import { Observable, of } from 'rxjs';
import { RemoteCallHandlerInterface } from '../../src/remote-call-handlers/remote-call-handler.interface';
import { RemoteCallInterface } from '../../src/remote-call/remote-call.interface';
import { RemoteResponse } from '../../src/response/remote-response';

export class RemoteCallHandlerFixture implements RemoteCallHandlerInterface {

  /**
   * @inheritDoc
   */
  //@ts-ignore
  handle(remoteCall: RemoteCallInterface, response: RemoteResponse<JsonType>): Observable<RemoteResponse<JsonType>> {
    return of(response);
  }

}
