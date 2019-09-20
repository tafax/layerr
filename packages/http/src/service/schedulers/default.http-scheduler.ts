
import { JsonType } from '@swiss/core';
import { Observable } from 'rxjs';
import { RemoteResponse } from '../../response/remote-response';
import { HttpAdapterInterface } from '../adapter/http-adapter.interface';
import { HttpSchedulerInterface } from './http-scheduler.interface';
import { HttpExecution } from '../http-execution';
import { HttpExecutorInterface } from '../executors/http-executor.interface';

/**
 * Defines the basic scheduler.
 * It schedules the request immediately so that we can potentially
 * perform calls in parallel.
 */
export class DefaultHttpScheduler implements HttpSchedulerInterface<JsonType> {

  /**
   * @inheritDoc
   */
  schedule(execution: HttpExecution, executor: HttpExecutorInterface<JsonType>, adapter: HttpAdapterInterface): Observable<RemoteResponse<JsonType>> {
    // Just immediately schedule the call.
    return executor.execute(execution, adapter);
  }

}
