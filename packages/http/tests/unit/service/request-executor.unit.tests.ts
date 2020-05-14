
import { MessageBus } from '@layerr/bus';
import { JsonType } from '@layerr/core';
import { suite, test, IMock, Mock, It } from '@layerr/test';
import { of } from 'rxjs';
import { RequestInterface } from '../../..';
import { HttpExecution } from '../../../src/http-execution';
import { RemoteResponse } from '../../../src/response/remote-response';
import { RequestExecutor } from '../../../src/service/request-executor';

@suite class RequestExecutorUnitTests {

  private requestExecutor: RequestExecutor;
  private messageBusMock: IMock<MessageBus<HttpExecution>>;

  before() {
    this.messageBusMock = Mock.ofType<MessageBus<HttpExecution>>();

    this.requestExecutor = new RequestExecutor(
      'baseHost',
      0,
      0,
      0,
      this.messageBusMock.object
    );
  }

  @test 'should execute a request'() {
    const request = <RequestInterface>{};

    const remoteResponse = <RemoteResponse<JsonType>>{};

    this.messageBusMock
      .setup(x => x.handle(It.is((execution: HttpExecution) => {
        execution.baseHost.should.be.eql('baseHost');
        execution.retryAttemptCount.should.be.eql(0);
        execution.retryDelay.should.be.eql(0);
        execution.timeout.should.be.eql(0);
        execution.request.should.be.eql(request);

        return true;
      })))
      .callback(action => action.response = remoteResponse)
      .returns(execution => of(execution))

    return this.requestExecutor.execute(request)
      .subscribe(
        (response) => {
          response.should.be.eql(remoteResponse);

          this.messageBusMock.verifyAll();
        }
      );
  }

}
