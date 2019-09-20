
import { JsonType } from '@swiss/core';
import { BehaviorSubject, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { catchError, concatMap, filter, flatMap, map, take } from 'rxjs/operators';
import { RemoteResponse } from '../../response/remote-response';
import { HttpAdapterInterface } from '../adapter/http-adapter.interface';
import { HttpSchedulerInterface } from './http-scheduler.interface';
import { HttpExecution } from '../http-execution';
import { HttpExecutorInterface } from '../executors/http-executor.interface';

// Defines an internal type to handle the sequence.
interface ExecutionContext<T> {
  executor: HttpExecutorInterface<T>;
  adapter: HttpAdapterInterface,
  execution: HttpExecution;
  result?: any;
}

/**
 * Defines a scheduler to execute a call in a sequence and to grant
 * any scheduled call will be executed after the previous one is
 * ended.
 */
export class SequentialHttpScheduler implements HttpSchedulerInterface<JsonType> {

  /**
   * The sequence of calls.
   */
  private _sequence$: Subject<ExecutionContext<any>> = new Subject();

  /**
   * The stream that handle the scheduling.
   */
  private _scheduling$: Subject<ExecutionContext<any>> = new BehaviorSubject(undefined);

  /**
   * Sequence subscription.
   */
  private _sequenceSubscription: Subscription;

  constructor() {
    // Creates the scheduling.
    this._sequenceSubscription = this._sequence$.asObservable()
      .pipe(
        // Executes the calls by granting they will be sequential.
        concatMap(
          (context: ExecutionContext<any>) => context.executor.execute(context.execution, context.adapter)
            .pipe(
              // Catches the error to avoid the scheduling is closed and threat it as a result.
              catchError((error: Error) => of(error)),
              // Handles the result by associating it to a specific context execution.
              map((result: any) => ({ ...context, result }))
            )
        )
      )
      .subscribe((context: ExecutionContext<any>) => this._scheduling$.next(context));
  }

  /**
   * @inheritDoc
   */
  schedule(execution: HttpExecution, executor: HttpExecutorInterface<JsonType>, adapter: HttpAdapterInterface): Observable<RemoteResponse<JsonType>> {

    // First schedule the execution.
    this._sequence$.next({
      executor: executor,
      adapter: adapter,
      execution: execution
    });

    // Then create a stream based on the scheduling that streams this specific execution.
    return this._scheduling$.asObservable()
      .pipe(
        // It should never happen, but it is for security.
        filter((context: ExecutionContext<JsonType>) => !!context),
        // Matches the execution with this one to allow just the correct result to pass.
        filter((context: ExecutionContext<JsonType>) => context.execution === execution),
        // Applies a take one to be sure this stream will be closed after the emission.
        take(1),
        // Gets the execution result.
        map((context: ExecutionContext<JsonType>) => context.result),
        // Just throw the result if it is an error.
        flatMap((result: any) => {
          if (result instanceof Error) {
            return throwError(result);
          }
          return of(result);
        })
      );
  }

  /**
   * Clears the global subscription.
   */
  clear() {
    if (!!this._sequenceSubscription) {
      this._sequenceSubscription.unsubscribe();
    }
  }

}
