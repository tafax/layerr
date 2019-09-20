
import { ClassType } from '@swiss/core';
import { RemoteCallHandlerInterface } from '../../remote-call-handlers/remote-call-handler.interface';
import { HttpSchedulerInterface } from '../../service/schedulers/http-scheduler.interface';
import { HttpExecutorInterface } from '../../service/executors/http-executor.interface';

/**
 * Defines the set of options we execute a remote call.
 * It is used to instruct the bus how to handle a specific call.
 */
export class RemoteCallOptions<T> {

  /**
   * The handler if we need to create it.
   */
  handler?: ClassType<RemoteCallHandlerInterface>;

  /**
   * Which scheduler to use for this call.
   */
  scheduler?: ClassType<HttpSchedulerInterface<T>>;

  /**
   * Which executor to use for this call.
   */
  executor?: ClassType<HttpExecutorInterface<T>>;

}
