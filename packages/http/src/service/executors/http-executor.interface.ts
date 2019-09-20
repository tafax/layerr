
import { Observable } from 'rxjs';
import { RemoteResponse } from '../../response/remote-response';
import { HttpAdapterInterface } from '../adapter/http-adapter.interface';
import { HttpExecution } from '../http-execution';

/**
 * Defines the executor interface.
 */
export interface HttpExecutorInterface<T> {

  /**
   * Executes the request using the executor.
   */
  execute(execution: HttpExecution, adapter: HttpAdapterInterface): Observable<RemoteResponse<T>>;

}
