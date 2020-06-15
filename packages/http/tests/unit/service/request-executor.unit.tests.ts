
import { MessageBus } from '@layerr/bus';
import { suite, test, IMock, Mock, It, Times, should } from '@layerr/test';
import { of } from 'rxjs';
import { HttpExecution } from '../../../src/http-execution';
import { RequestInterface } from '../../../src/request/request.interface';
import { RequestExecutor } from '../../../src/service/request-executor';

@suite class RequestExecutorUnitTests {

  private requestExecutor: RequestExecutor;
  private messageBusMock: IMock<MessageBus<HttpExecution<any>>>;

  before() {
    this.messageBusMock = Mock.ofType<MessageBus<HttpExecution<any>>>();

    this.requestExecutor = new RequestExecutor(
      'baseHost',
      0,
      0,
      0,
      this.messageBusMock.object
    );
  }

  @test 'should execute a request'() {

    const requestMock = Mock.ofType<RequestInterface>();
    requestMock
      .setup(x => x.clone(It.isAny()))
      .returns(() => requestMock.object)
      .verifiable(Times.once());

    this.messageBusMock
      .setup(x => x.handle(It.is((execution: HttpExecution<any>) => {
        execution.baseHost.should.be.eql('baseHost');
        execution.retryAttemptCount.should.be.eql(0);
        execution.retryDelay.should.be.eql(0);
        execution.timeout.should.be.eql(0);
        should.equal(execution.request, requestMock.object);

        return true;
      })))
      .callback(action => {
        action.content = {};
      })
      .returns(execution => of(execution))

    return this.requestExecutor.execute(requestMock.object)
      .subscribe(
        (response: any) => {

          response.should.be.eql({});

          this.messageBusMock.verifyAll();
        }
      );
  }

}
