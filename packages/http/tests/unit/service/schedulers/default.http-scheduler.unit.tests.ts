
import { JsonType } from '@swiss/core';
import { of } from 'rxjs';
import { suite, test, Mock, Times, IMock } from '@swiss/test';
import { RemoteResponse } from '../../../../src/response/remote-response';
import { HttpAdapterInterface } from '../../../../src/service/adapter/http-adapter.interface';
import { HttpExecutorInterface } from '../../../../src/service/executors/http-executor.interface';
import { HttpExecution } from '../../../../src/service/http-execution';
import { DefaultHttpScheduler } from '../../../../src/service/schedulers/default.http-scheduler';

//@ts-ignore
@suite class DefaultHttpSchedulerUnitTests {

  private scheduler: DefaultHttpScheduler;
  private adapterMock: IMock<HttpAdapterInterface>;

  before() {

    this.adapterMock = Mock.ofType<HttpAdapterInterface>()

    this.scheduler = new DefaultHttpScheduler();
  }

  @test 'should schedule the remote call'() {

    const execution = new HttpExecution();

    const executorMock = Mock.ofType<HttpExecutorInterface<any>>();

    const response = new RemoteResponse((<JsonType>{}));

    executorMock
      .setup(x => x.execute(execution, this.adapterMock.object))
      .returns(() => of(response))
      .verifiable(Times.once());

    return this.scheduler.schedule(execution, executorMock.object, this.adapterMock.object)
      .subscribe(
        (result: RemoteResponse<any>) => {

          result.should.be.eql(response);

          executorMock.verifyAll();
        }
      );

  }

}
