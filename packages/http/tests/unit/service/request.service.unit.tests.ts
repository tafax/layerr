
import { MessageBusInterface, MessageBusMiddlewareInterface } from '@swiss/bus';
import { suite, test, IMock, Mock, It, Times, should } from '@swiss/test';
import { of } from 'rxjs';
import { RemoteCallInterface } from '../../../src/remote-call/remote-call.interface';
import { HttpExecution } from '../../../src/service/http-execution';
import { RequestService } from '../../../src/service/request.service';

//@ts-ignore
@suite class RequestServiceUnitTests {

  private requestService: RequestService;

  private executionBusMock: IMock<MessageBusInterface<HttpExecution>>;

  before() {

    this.executionBusMock = Mock.ofType<MessageBusInterface<HttpExecution>>();

    this.requestService = new RequestService(
      this.executionBusMock.object
    );
  }

  @test 'should set the service properties'() {

    this.requestService.baseHost = 'baseHost';
    this.requestService.retryAttemptCount = 3;
    this.requestService.retryDelay = 100;
    this.requestService.timeout = 100;

    this.requestService.baseHost.should.be.equal('baseHost');
    this.requestService.retryAttemptCount.should.be.equal(3);
    this.requestService.retryDelay.should.be.equal(100);
    this.requestService.timeout.should.be.equal(100);
  }

  @test 'should create the execution and send it to the bus'() {

    this.requestService.baseHost = 'baseHost';
    this.requestService.retryAttemptCount = 3;
    this.requestService.retryDelay = 100;
    this.requestService.timeout = 100;

    const remoteCallMock = Mock.ofType<RemoteCallInterface>();

    this.executionBusMock
      .setup(x => x.handle(It.is((execution: HttpExecution) => {
        execution.baseHost.should.be.eql(this.requestService.baseHost);
        execution.retryAttemptCount.should.be.eql(this.requestService.retryAttemptCount);
        execution.retryDelay.should.be.eql(this.requestService.retryDelay);
        execution.timeout.should.be.eql(this.requestService.timeout);
        should.equal(execution.remoteCall, remoteCallMock.object);

        return true;
      })))
      .returns(() => of(undefined))
      .verifiable(Times.once());

    return this.requestService.execute(remoteCallMock.object);
  }

  @test 'should allow to use a middleware'() {

    const middlewareMock = Mock.ofType<MessageBusMiddlewareInterface>();

    this.executionBusMock
      .setup(x => x.appendMiddleware(middlewareMock.object))
      .verifiable(Times.once());

    this.requestService.useMiddleware(middlewareMock.object);
  }

}
