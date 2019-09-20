
import { ClassResolverInterface, MetadataResolverInterface, LoggerInterface, ClassType, JsonType } from '@swiss/core';
import { suite, test, IMock, Mock, Times, It } from '@swiss/test';
import { of } from 'rxjs';
import { RemoteCallOptions } from '../../../src/decorators/configurations/remote-call.options';
import { HttpBusError } from '../../../src/errors/http-bus.error';
import { SchedulingExecutionBusMiddleware } from '../../../src/middlewares/scheduling-execution.bus-middleware';
import { RemoteCallInterface } from '../../../src/remote-call/remote-call.interface';
import { RemoteResponse } from '../../../src/response/remote-response';
import { HttpAdapterInterface } from '../../../src/service/adapter/http-adapter.interface';
import { HttpExecutorInterface } from '../../../src/service/executors/http-executor.interface';
import { HttpExecution } from '../../../src/service/http-execution';
import { HttpSchedulerInterface } from '../../../src/service/schedulers/http-scheduler.interface';

//@ts-ignore
@suite class SchedulingExecutionBusMiddlewareUnitTests {

  private schedulingExecutionBusMiddleware: SchedulingExecutionBusMiddleware;

  private classResolverMock: IMock<ClassResolverInterface>;
  private extractorMock: IMock<MetadataResolverInterface>;
  private adapterMock: IMock<HttpAdapterInterface>;
  private loggerMock: IMock<LoggerInterface>;

  before() {

    this.classResolverMock = Mock.ofType<ClassResolverInterface>();
    this.extractorMock = Mock.ofType<MetadataResolverInterface>();
    this.adapterMock = Mock.ofType<HttpAdapterInterface>();
    this.loggerMock = Mock.ofType<LoggerInterface>();

    this.schedulingExecutionBusMiddleware = new SchedulingExecutionBusMiddleware(
      this.classResolverMock.object,
      this.extractorMock.object,
      this.adapterMock.object,
      this.loggerMock.object
    );
  }

  @test 'should collect the executor and the scheduler and call the schedule'() {

    //@ts-ignore
    class RemoteCall implements RemoteCallInterface {}

    const remoteCallMock = new RemoteCall();

    const executorClassMock = Mock.ofType<ClassType<HttpExecutorInterface<any>>>();
    const schedulerClassMock = Mock.ofType<ClassType<HttpSchedulerInterface<any>>>();

    const execution = new HttpExecution();
    //@ts-ignore
    execution.remoteCall = remoteCallMock;

    const options = new RemoteCallOptions();
    options.executor = executorClassMock.object;
    options.scheduler = schedulerClassMock.object;

    const executor = Mock.ofType<HttpExecutorInterface<any>>();
    const scheduler = Mock.ofType<HttpSchedulerInterface<any>>();

    const response = new RemoteResponse((<JsonType>{}));

    this.extractorMock
      .setup(x => x.getMetadata(<ClassType<RemoteCall>>remoteCallMock.constructor))
      .returns(() => options)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(executorClassMock.object))
      .returns(() => executor.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(schedulerClassMock.object))
      .returns(() => scheduler.object)
      .verifiable(Times.once());

    scheduler
      .setup(x => x.schedule(It.isAny(), executor.object, this.adapterMock.object))
      .returns(() => of(response));

    return this.schedulingExecutionBusMiddleware.handle(execution, (reult: any) => of(reult))
      .subscribe((result: HttpExecution) => {

        result.should.be.equal(execution);
        result.response.should.be.equal(response);

        this.extractorMock.verifyAll();
        this.classResolverMock.verifyAll();
        this.adapterMock.verifyAll();
        scheduler.verifyAll();
      });

  }

  @test 'should throw an error if no options are found'() {

    //@ts-ignore
    class RemoteCall implements RemoteCallInterface {}

    const remoteCallMock = new RemoteCall();

    const executorClassMock = Mock.ofType<ClassType<HttpExecutorInterface<any>>>();
    const schedulerClassMock = Mock.ofType<ClassType<HttpSchedulerInterface<any>>>();

    const execution = new HttpExecution();
    //@ts-ignore
    execution.remoteCall = remoteCallMock;

    const options = new RemoteCallOptions();
    options.executor = executorClassMock.object;
    options.scheduler = schedulerClassMock.object;

    const executor = Mock.ofType<HttpExecutorInterface<any>>();
    const scheduler = Mock.ofType<HttpSchedulerInterface<any>>();

    const response = new RemoteResponse((<JsonType>{}));

    this.extractorMock
      .setup(x => x.getMetadata(<ClassType<RemoteCall>>remoteCallMock.constructor))
      .returns(() => undefined)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(executorClassMock.object))
      .returns(() => executor.object)
      .verifiable(Times.never());

    this.classResolverMock
      .setup(x => x.resolve(schedulerClassMock.object))
      .returns(() => scheduler.object)
      .verifiable(Times.never());

    scheduler
      .setup(x => x.schedule(execution, executor.object, this.adapterMock.object))
      .returns(() => of(response));

    return this.schedulingExecutionBusMiddleware.handle(execution, (reult: any) => of(reult))
      .subscribe(
          () => { throw new Error('it-should-be-never-called'); },
          (error: Error) => {

            error.should.be.instanceof(HttpBusError);

            this.extractorMock.verifyAll();
            this.classResolverMock.verifyAll();
            this.adapterMock.verifyAll();
            scheduler.verifyAll();
          }
        );

  }

  @test 'should throw an error if no executor can be resolved'() {

    //@ts-ignore
    class RemoteCall implements RemoteCallInterface {}

    const remoteCallMock = new RemoteCall();

    const executorClassMock = Mock.ofType<ClassType<HttpExecutorInterface<any>>>();
    const schedulerClassMock = Mock.ofType<ClassType<HttpSchedulerInterface<any>>>();

    const execution = new HttpExecution();
    //@ts-ignore
    execution.remoteCall = remoteCallMock;

    const options = new RemoteCallOptions();
    options.executor = executorClassMock.object;
    options.scheduler = schedulerClassMock.object;

    const executor = Mock.ofType<HttpExecutorInterface<any>>();
    const scheduler = Mock.ofType<HttpSchedulerInterface<any>>();

    const response = new RemoteResponse((<JsonType>{}));

    this.extractorMock
      .setup(x => x.getMetadata(<ClassType<RemoteCall>>remoteCallMock.constructor))
      .returns(() => options)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(executorClassMock.object))
      .returns(() => undefined)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(schedulerClassMock.object))
      .returns(() => scheduler.object)
      .verifiable(Times.never());

    scheduler
      .setup(x => x.schedule(execution, executor.object, this.adapterMock.object))
      .returns(() => of(response));

    return this.schedulingExecutionBusMiddleware.handle(execution, (reult: any) => of(reult))
      .subscribe(
        () => { throw new Error('it-should-be-never-called'); },
        (error: Error) => {

          error.should.be.instanceof(HttpBusError);

          this.extractorMock.verifyAll();
          this.classResolverMock.verifyAll();
          this.adapterMock.verifyAll();
          scheduler.verifyAll();
        }
      );

  }

  @test 'should throw an error if no scheduler can be resolved'() {

    //@ts-ignore
    class RemoteCall implements RemoteCallInterface {}

    const remoteCallMock = new RemoteCall();

    const executorClassMock = Mock.ofType<ClassType<HttpExecutorInterface<any>>>();
    const schedulerClassMock = Mock.ofType<ClassType<HttpSchedulerInterface<any>>>();

    const execution = new HttpExecution();
    //@ts-ignore
    execution.remoteCall = remoteCallMock;

    const options = new RemoteCallOptions();
    options.executor = executorClassMock.object;
    options.scheduler = schedulerClassMock.object;

    const executor = Mock.ofType<HttpExecutorInterface<any>>();
    const scheduler = Mock.ofType<HttpSchedulerInterface<any>>();

    const response = new RemoteResponse((<JsonType>{}));

    this.extractorMock
      .setup(x => x.getMetadata(<ClassType<RemoteCall>>remoteCallMock.constructor))
      .returns(() => options)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(executorClassMock.object))
      .returns(() => executor.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(schedulerClassMock.object))
      .returns(() => undefined)
      .verifiable(Times.once());

    scheduler
      .setup(x => x.schedule(execution, executor.object, this.adapterMock.object))
      .returns(() => of(response));

    return this.schedulingExecutionBusMiddleware.handle(execution, (reult: any) => of(reult))
      .subscribe(
        () => { throw new Error('it-should-be-never-called'); },
        (error: Error) => {

          error.should.be.instanceof(HttpBusError);

          this.extractorMock.verifyAll();
          this.classResolverMock.verifyAll();
          this.adapterMock.verifyAll();
          scheduler.verifyAll();
        }
      );

  }

}
