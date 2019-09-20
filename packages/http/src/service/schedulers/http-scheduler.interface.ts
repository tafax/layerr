
import { Observable } from 'rxjs';
import { RemoteResponse } from '../../response/remote-response';
import { HttpAdapterInterface } from '../adapter/http-adapter.interface';
import { HttpExecution } from '../http-execution';
import { HttpExecutorInterface } from '../executors/http-executor.interface';

/**
 * Defines an interface to represent a scheduler.
 * It is useful to allow any remote call to be scheduled
 * in a specific manner.
 */
export interface HttpSchedulerInterface<T> {

  /**
   * Schedule the remote call for the execution.
   */
  schedule(execution: HttpExecution, executor: HttpExecutorInterface<T>, adapter: HttpAdapterInterface): Observable<RemoteResponse<T>>;

}
