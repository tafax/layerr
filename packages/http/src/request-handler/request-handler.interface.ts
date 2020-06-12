
import { JsonType } from '@layerr/core';
import { Observable } from 'rxjs';
import { RequestInterface } from '../request/request.interface';
import { RemoteResponse } from '../response/remote-response';

/**
 * Defines the interface for each object that handles
 * a specific action request.
 */
export interface RequestHandlerInterface {

  /**
   * Handles a specific remote call.
   */
  handle(remoteCall: RequestInterface, response: RemoteResponse<JsonType>): Observable<any>;

}
