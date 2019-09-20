
import { ClassResolverInterface, LoggerInterface, JsonType } from '@swiss/core';
import { suite, test, IMock, Mock, It, Times, should } from '@swiss/test';
import { of, throwError } from 'rxjs';
import { HttpBusError } from '../../src/errors/http-bus.error';
import { RequestServiceFactory } from '../../src/factories/request-service.factory';
import { ErrorRemoteResponse } from '../../src/response/error-remote-response';
import { RemoteResponse } from '../../src/response/remote-response';
import { HttpAdapterInterface } from '../../src/service/adapter/http-adapter.interface';
import { DefaultHttpExecutor } from '../../src/service/executors/default.http-executor';
import { HttpExecutorInterface } from '../../src/service/executors/http-executor.interface';
import { RequestService } from '../../src/service/request.service';
import { DefaultHttpScheduler } from '../../src/service/schedulers/default.http-scheduler';
import { HttpSchedulerInterface } from '../../src/service/schedulers/http-scheduler.interface';
import { RemoteCallFixture } from '../fixtures/remote-call.fixture';
import { RemoteCallHandlerFixture } from '../fixtures/remote-call-handler.fixture';

//@ts-ignore
@suite class RequestServiceUnitTests {

  private requestService: RequestService;

  private classResolverMock: IMock<ClassResolverInterface>;
  private httpAdapterMock: IMock<HttpAdapterInterface>;
  private loggerMock: IMock<LoggerInterface>;

  before() {

    this.classResolverMock = Mock.ofType<ClassResolverInterface>();
    this.httpAdapterMock = Mock.ofType<HttpAdapterInterface>();
    this.loggerMock = Mock.ofType<LoggerInterface>();

    this.requestService = RequestServiceFactory.Create(
      this.classResolverMock.object,
      this.httpAdapterMock.object,
      undefined,
      this.loggerMock.object
    );
  }

  @test 'should set the service properties'() {
    this.requestService.baseHost = 'baseHost';
    this.requestService.retryAttemptCount = 3;
    this.requestService.retryDelay = 100;

    this.requestService.baseHost.should.be.equal('baseHost');
    this.requestService.retryAttemptCount.should.be.equal(3);
    this.requestService.retryDelay.should.be.equal(100);
  }

  @test 'should throw an error if it can\'t resolve the executor'() {

    this.classResolverMock.setup(x => x.resolve(It.isAny()))
      .returns(() => undefined)
      .verifiable(Times.once());

    return this.requestService.execute(new RemoteCallFixture('path'))
      .subscribe(
          () => { throw new Error('it-should-be-never-called'); },
          (error: Error) => {

            error.should.be.instanceOf(HttpBusError);

            this.classResolverMock.verifyAll();
          }
        );

  }

  @test 'should throw an error if it can\'t resolve the scheduler'() {

    const executorMock = Mock.ofType<HttpExecutorInterface<any>>();

    this.classResolverMock.setup(x => x.resolve(DefaultHttpExecutor))
      .returns(() => executorMock.object)
      .verifiable(Times.once());

    this.classResolverMock.setup(x => x.resolve(DefaultHttpScheduler))
      .returns(() => undefined)
      .verifiable(Times.once());

    return this.requestService.execute(new RemoteCallFixture('path'))
      .subscribe(
        () => { throw new Error('it-should-be-never-called'); },
        (error: Error) => {

          error.should.be.instanceOf(HttpBusError);

          this.classResolverMock.verifyAll();
        }
      );

  }

  @test 'should throw an error if it can\'t resolve the handler but it is set'() {

    const executorMock = Mock.ofType<HttpExecutorInterface<any>>();
    const schedulerMock = Mock.ofType<HttpSchedulerInterface<any>>();

    const response = new RemoteResponse((<JsonType>{}));

    this.classResolverMock
      .setup(x => x.resolve(DefaultHttpExecutor))
      .returns(() => executorMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(DefaultHttpScheduler))
      .returns(() => schedulerMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(RemoteCallHandlerFixture))
      .returns(() => undefined)
      .verifiable(Times.once());

    schedulerMock
      .setup(x => x.schedule(It.isAny(), executorMock.object, this.httpAdapterMock.object))
      .returns(() => of(response))
      .verifiable(Times.once());

    return this.requestService.execute(new RemoteCallFixture('path'))
      .subscribe(
        () => { throw new Error('it-should-be-never-called'); },
        (error: Error) => {

          error.should.be.instanceOf(HttpBusError);

          schedulerMock.verifyAll();
          this.classResolverMock.verifyAll();
        }
      );

  }

  @test 'should execute the remote call and handle it with the handler'() {

    const executorMock = Mock.ofType<HttpExecutorInterface<any>>();
    const schedulerMock = Mock.ofType<HttpSchedulerInterface<any>>();

    const response = new RemoteResponse((<JsonType>{}));

    this.classResolverMock
      .setup(x => x.resolve(DefaultHttpExecutor))
      .returns(() => executorMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(DefaultHttpScheduler))
      .returns(() => schedulerMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(RemoteCallHandlerFixture))
      .returns(() => new RemoteCallHandlerFixture())
      .verifiable(Times.once());

    schedulerMock
      .setup(x => x.schedule(It.isAny(), executorMock.object, this.httpAdapterMock.object))
      .returns(() => of(response))
      .verifiable(Times.once());

    return this.requestService.execute(new RemoteCallFixture('path'))
      .subscribe(
        (result: RemoteResponse<JsonType>) => {

          result.body.should.be.eql(response.body);

          schedulerMock.verifyAll();
          this.classResolverMock.verifyAll();
        }
      );

  }

  @test 'should handle the network errors'() {

    const executorMock = Mock.ofType<HttpExecutorInterface<any>>();
    const schedulerMock = Mock.ofType<HttpSchedulerInterface<any>>();

    this.classResolverMock
      .setup(x => x.resolve(DefaultHttpExecutor))
      .returns(() => executorMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(DefaultHttpScheduler))
      .returns(() => schedulerMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(RemoteCallHandlerFixture))
      .returns(() => new RemoteCallHandlerFixture())
      .verifiable(Times.once());

    const errorRemoteResponse = new ErrorRemoteResponse(
      'error',
      undefined,
      undefined,
      undefined,
      400,
      '400',
      'path'
    );

    schedulerMock
      .setup(x => x.schedule(It.isAny(), executorMock.object, this.httpAdapterMock.object))
      .returns(() => throwError(errorRemoteResponse))
      .verifiable(Times.once());

    const remoteCall = new RemoteCallFixture('path');

    return this.requestService.execute(remoteCall)
      .subscribe(
        () => { throw new Error('it-should-never-be-called'); },
        (error: Error) => {

          error.should.be.instanceOf(HttpBusError);

          const errorNetwork = <HttpBusError>error;
          errorNetwork.message.should.be.equal('400 - error');
          errorNetwork.status.should.be.equal(400);
          should.equal(errorNetwork.remoteCall, remoteCall);

        }
      );
  }

  @test 'should re-throw any other error'() {

    const executorMock = Mock.ofType<HttpExecutorInterface<any>>();
    const schedulerMock = Mock.ofType<HttpSchedulerInterface<any>>();

    this.classResolverMock
      .setup(x => x.resolve(DefaultHttpExecutor))
      .returns(() => executorMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(DefaultHttpScheduler))
      .returns(() => schedulerMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(RemoteCallHandlerFixture))
      .returns(() => new RemoteCallHandlerFixture())
      .verifiable(Times.once());

    schedulerMock
      .setup(x => x.schedule(It.isAny(), executorMock.object, this.httpAdapterMock.object))
      .returns(() => throwError(new Error('AN-ERROR')))
      .verifiable(Times.once());

    return this.requestService.execute(new RemoteCallFixture('path'))
      .subscribe(
        () => { throw new Error('it-should-never-be-called'); },
        (error: Error) => {

          error.should.be.instanceOf(Error);
          error.message.should.be.equal('AN-ERROR');

        }
      );
  }

}
