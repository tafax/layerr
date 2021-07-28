import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { suite, test } from '@testdeck/jest';
import { of } from 'rxjs';
import { mock, instance, when, anything, anyOfClass } from 'ts-mockito';
import { MessageBus } from '../../../../bus/src/lib/bus/message-bus';
import { HttpExecution } from '../../../src/lib/http-execution';
import { RequestInterface } from '../../../src/lib/request/request.interface';
import { RequestExecutor } from '../../../src/lib/service/request-executor';

@suite class RequestExecutorUnitTest {

  private SUT: RequestExecutor;
  private messageBus: MessageBus<HttpExecution<unknown>>;

  before() {
    this.messageBus = mock<MessageBus<HttpExecution<unknown>>>();

    this.SUT = new RequestExecutor(
      'baseHost',
      0,
      0,
      0,
      instance(this.messageBus),
    );
  }

  @test givenRequest_whenExecute_thenReturnResponse() {
    const request = mock<RequestInterface>();
    when(request.clone(anything())).thenReturn(instance(request));

    when(this.messageBus.handle(anyOfClass(HttpExecution))).thenCall(
      (execution: HttpExecution<unknown>) => of(execution.clone({ content: { result: 'result' } })),
    );

    const observable = subscribeSpyTo(this.SUT.execute(instance(request)));
    expect(observable.receivedComplete()).toBeTruthy();
    expect(observable.getLastValue()).toStrictEqual({ result: 'result' });
  }

}
