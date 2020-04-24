
import { Observable } from 'rxjs';
import { RequestInterface } from '../request/request.interface';
import { RemoteResponse } from '../response/remote-response';

/**
 * The adapter to execute the remote call depending
 * on the framework.
 */
export interface HttpAdapterInterface {

  /**
   * Executes the call using the specific adapter.
   */
  execute<T>(remoteCall: RequestInterface): Observable<RemoteResponse<T>>;

}
