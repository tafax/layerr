
import { JsonType } from '@swiss/core';
import { of, throwError } from 'rxjs';
import { suite, test, Mock, Times, IMock } from '@swiss/test';
import { RemoteResponse } from '../../../../src/response/remote-response';
import { HttpAdapterInterface } from '../../../../src/service/adapter/http-adapter.interface';
import { HttpExecutorInterface } from '../../../../src/service/executors/http-executor.interface';
import { HttpExecution } from '../../../../src/service/http-execution';
import { SequentialHttpScheduler } from '../../../../src/service/schedulers/sequential.http-scheduler';

//@ts-ignore
@suite class SequentialHttpSchedulerUnitTests {

  private scheduler: SequentialHttpScheduler;
  private adapterMock: IMock<HttpAdapterInterface>;

  before() {
    this.adapterMock = Mock.ofType<HttpAdapterInterface>()

    this.scheduler = new SequentialHttpScheduler();
  }

  @test 'should perform a call by calling the subscriber'(done) {

    const execution = new HttpExecution();
    const response = new RemoteResponse((<JsonType>{}));

    const executorMock = Mock.ofType<HttpExecutorInterface<JsonType>>();

    executorMock.setup(x => x.execute(execution, this.adapterMock.object))
      .returns(() => of(response))
      .verifiable(Times.once());

    return this.scheduler.schedule(execution, executorMock.object, this.adapterMock.object)
      .subscribe(
        (value: any) => {
          value.should.be.equal(response);
          executorMock.verifyAll();
        },
        (error: Error) => { throw error; },
        () => done()
      );

  }

  @test 'should perform two calls sequentially by calling the subscribers accordingly'() {

    const execution1 = new HttpExecution();
    execution1.baseHost = '1';

    const execution2 = new HttpExecution();
    execution2.baseHost = '2';

    const result1 = new RemoteResponse((<JsonType>{}));
    const result2 = new RemoteResponse((<JsonType>{}));

    const executorMock = Mock.ofType<HttpExecutorInterface<JsonType>>();

    executorMock.setup(x => x.execute(execution1, this.adapterMock.object))
      .returns(() => of(result1))
      .verifiable(Times.once());

    executorMock.setup(x => x.execute(execution2, this.adapterMock.object))
      .returns(() => of(result2))
      .verifiable(Times.once());

    const callback1 = Mock.ofInstance((value: any) => value);
    const callback2 = Mock.ofInstance((value: any) => value);

    callback1.setup(x => x(result1))
      .verifiable(Times.once());

    callback2.setup(x => x(result2))
      .verifiable(Times.once());

    const subscription1 = this.scheduler.schedule(execution1, executorMock.object, this.adapterMock.object)
      .subscribe((value: any) => {
        callback1.object(value);
        value.should.be.equal(result1);
      });

    const subscription2 = this.scheduler.schedule(execution2, executorMock.object, this.adapterMock.object)
      .subscribe((value: any) => {
        callback2.object(value);
        value.should.be.equal(result2);
        callback1.verifyAll();
        callback2.verifyAll();
        executorMock.verifyAll();
      });

    return subscription1.add(subscription2);

  }

  @test 'should perform multiple calls sequentially by calling the subscribers accordingly'() {

    const execution1 = new HttpExecution();
    execution1.baseHost = '1';

    const execution2 = new HttpExecution();
    execution2.baseHost = '2';

    const result1 = new RemoteResponse((<JsonType>{}));
    const result2 = new RemoteResponse((<JsonType>{}));

    const executorMock = Mock.ofType<HttpExecutorInterface<JsonType>>();

    executorMock.setup(x => x.execute(execution1, this.adapterMock.object))
      .returns(() => of(result1))
      .verifiable(Times.exactly(2));

    executorMock.setup(x => x.execute(execution2, this.adapterMock.object))
      .returns(() => of(result2))
      .verifiable(Times.once());

    const callback1 = Mock.ofInstance((value: any) => value);
    const callback2 = Mock.ofInstance((value: any) => value);
    const callback3 = Mock.ofInstance((value: any) => value);

    callback1.setup(x => x(result1))
      .verifiable(Times.once());

    callback2.setup(x => x(result2))
      .verifiable(Times.once());

    callback3.setup(x => x(result1))
      .verifiable(Times.once());

    const subscription1 = this.scheduler.schedule(execution1, executorMock.object, this.adapterMock.object)
      .subscribe((value: any) => {
        callback1.object(value);
        value.should.be.equal(result1);
      });

    const subscription2 = this.scheduler.schedule(execution2, executorMock.object, this.adapterMock.object)
      .subscribe((value: any) => {
        callback2.object(value);
        value.should.be.equal(result2);
      });

    const subscription3 = this.scheduler.schedule(execution1, executorMock.object, this.adapterMock.object)
      .subscribe((value: any) => {
        callback3.object(value);
        value.should.be.equal(result1);

        callback1.verifyAll();
        callback2.verifyAll();
        callback3.verifyAll();
        executorMock.verifyAll();
      });

    return subscription1.add(subscription2).add(subscription3);

  }

  @test 'should perform two calls and catch the errors accordingly to the sequence'() {

    const execution1 = new HttpExecution();
    execution1.baseHost = '1';

    const execution2 = new HttpExecution();
    execution2.baseHost = '2';

    const result2 = new RemoteResponse((<JsonType>{}));

    const executorMock = Mock.ofType<HttpExecutorInterface<JsonType>>();

    executorMock.setup(x => x.execute(execution1, this.adapterMock.object))
      .returns(() => throwError(new Error('AN-ERROR')))
      .verifiable(Times.once());

    executorMock.setup(x => x.execute(execution2, this.adapterMock.object))
      .returns(() => of(result2))
      .verifiable(Times.once());

    const callback2 = Mock.ofInstance((value: any) => value);

    callback2.setup(x => x(result2))
      .verifiable(Times.once());

    const subscription1 = this.scheduler.schedule(execution1, executorMock.object, this.adapterMock.object)
      .subscribe(
        () => { throw new Error('it-should-be-never-called'); },
        (error: Error) => {
          error.should.be.instanceOf(Error);
        }
      );

    const subscription2 = this.scheduler.schedule(execution2, executorMock.object, this.adapterMock.object)
      .subscribe((value: any) => {
        callback2.object(value);
        value.should.be.equal(result2);

        callback2.verifyAll();
        executorMock.verifyAll();
      });

    return subscription1.add(subscription2);

  }

}
