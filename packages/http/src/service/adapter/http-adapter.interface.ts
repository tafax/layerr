
import { Observable } from 'rxjs';
import { RemoteCallInterface } from '../../remote-call/remote-call.interface';
import { RemoteResponse } from '../../response/remote-response';

/**
 * The adapter to execute the remote call depending
 * on the framework.
 */
export interface HttpAdapterInterface {

  /**
   * Executes the call using the specific adapter.
   */
  execute<T>(remoteCall: RemoteCallInterface): Observable<RemoteResponse<T>>;

}
