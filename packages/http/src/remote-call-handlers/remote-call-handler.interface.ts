
import { JsonType } from '@swiss/core';
import { Observable } from 'rxjs';
import { RemoteCallInterface } from '../remote-call/remote-call.interface';
import { RemoteResponse } from '../response/remote-response';

/**
 * Defines the interface for each object that handles
 * a specific action request.
 */
export interface RemoteCallHandlerInterface {

  /**
   * Handles a specific remote call.
   */
  handle(remoteCall: RemoteCallInterface, response: RemoteResponse<JsonType>): Observable<RemoteResponse<JsonType>>;

}
