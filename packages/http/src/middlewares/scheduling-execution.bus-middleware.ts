
import { MessageBusMiddlewareInterface } from '@swiss/bus';
import { ClassType, MetadataResolverInterface, ClassResolverInterface, LoggerInterface, JsonType } from '@swiss/core';
import { Observable, throwError } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { RemoteCallOptions } from '../decorators/configurations/remote-call.options';
import { HttpBusError } from '../errors/http-bus.error';
import { HttpBusErrorType } from '../errors/http-bus.error-type';
import { RemoteCallInterface } from '../remote-call/remote-call.interface';
import { RemoteResponse } from '../response/remote-response';
import { HttpAdapterInterface } from '../service/adapter/http-adapter.interface';
import { DefaultHttpExecutor } from '../service/executors/default.http-executor';
import { HttpExecution } from '../service/http-execution';
import { DefaultHttpScheduler } from '../service/schedulers/default.http-scheduler';

export class SchedulingExecutionBusMiddleware implements MessageBusMiddlewareInterface {

  constructor(
    private _classResolver: ClassResolverInterface,
    private _extractor: MetadataResolverInterface,
    private _adapter: HttpAdapterInterface,
    private _logger: LoggerInterface
  ) {}

  /**
   * @inheritDoc
   */
  handle(execution: HttpExecution, next: (execution: HttpExecution) => Observable<any>): Observable<any> {

    // Gets the options for this remote call.
    const options = <RemoteCallOptions<any>>this._extractor.getMetadata(
      <ClassType<RemoteCallInterface>>execution.remoteCall.constructor
    );

    // We have to stop the execution if we can't find a scheduler.
    if (!options) {
      this._logger.error(`Unable to find options for ${execution.remoteCall.constructor}`);
      return throwError(new HttpBusError(
        `Unable to find a scheduler for ${execution.remoteCall.constructor}`,
        HttpBusErrorType.INTERNAL
      ));
    }

    // Sets the options in the execution.
    execution.options = options;

    // Resolves the executor.
    const executor = this._classResolver.resolve(options.executor || DefaultHttpExecutor);

    // We have to stop the execution if we can't find a scheduler.
    if (!executor) {
      const name = !!options.executor ? options.executor.name : options.executor;
      this._logger.error(`Unable to find an executor for ${name}`);
      return throwError(new HttpBusError(
        `Unable to find an executor for ${name}`,
        HttpBusErrorType.INTERNAL
      ));
    }

    // Resolves the scheduler.
    const scheduler = this._classResolver.resolve(options.scheduler || DefaultHttpScheduler);

    // We have to stop the execution if we can't find a scheduler.
    if (!scheduler) {
      const name = !!options.scheduler ? options.scheduler.name : options.scheduler;
      this._logger.error(`Unable to find a scheduler for ${name}`);
      return throwError(new HttpBusError(
        `Unable to find a scheduler for ${name}`,
        HttpBusErrorType.INTERNAL
      ));
    }

    return scheduler.schedule(execution, executor, this._adapter)
      .pipe(
        tap((response: RemoteResponse<JsonType>) => execution.response = response),
        concatMap(() => next(execution))
      );
  }

}
