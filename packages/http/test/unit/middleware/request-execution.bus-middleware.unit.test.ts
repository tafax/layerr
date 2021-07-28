import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { suite, test } from '@testdeck/jest';
import { of, throwError } from 'rxjs';
import { mock, instance, when, deepEqual, anything, verify } from 'ts-mockito';
import { resolvableInstance } from '../../../../../tests/index';
import { HttpAdapterInterface } from '../../../src/lib/adapter/http-adapter.interface';
import { HttpExecution } from '../../../src/lib/http-execution';
import { RequestExecutionBusMiddleware } from '../../../src/lib/middleware/request-execution.bus-middleware';
import { RequestInterface } from '../../../src/lib/request/request.interface';
import { ErrorRemoteResponse } from '../../../src/lib/response/error-remote-response';
import { RemoteResponse } from '../../../src/lib/response/remote-response';
import { HttpHeaders } from '../../../src/lib/utilities/http-headers';

@suite
class RequestExecutionBusMiddlewareUnitTest {

  private SUT: RequestExecutionBusMiddleware;
  private adapter: HttpAdapterInterface;

  before() {
    this.adapter = mock<HttpAdapterInterface>();
    this.SUT = new RequestExecutionBusMiddleware(
      instance(this.adapter),
    );
  }

  private static CreateExecution(): HttpExecution<unknown> {
    const execution = mock<HttpExecution<unknown>>();
    const request = mock<RequestInterface>();
    when(request.clone(anything())).thenReturn(resolvableInstance(request));

    when(execution.baseHost).thenReturn('baseHost');
    when(execution.request).thenReturn(resolvableInstance(request));
    when(execution.clone(anything())).thenReturn(resolvableInstance(execution));
    return execution;
  }

  @test
  givenExecutionAndNext_whenHandle_thenReturnResponse() {
    const execution = RequestExecutionBusMiddlewareUnitTest.CreateExecution();

    const response = new RemoteResponse(
      null,
      new HttpHeaders(),
      0,
      'statusText',
      'url',
    );

    when(this.adapter.execute('baseHost', anything())).thenReturn(of(response));

    const next = jest.fn((message: HttpExecution<unknown>) => of(message));

    const observable = subscribeSpyTo(this.SUT.handle(instance(execution), next));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();

    verify(execution.request).once();
    verify(execution.clone(deepEqual({ response }))).once();
  }

  @test
  givenExecutionAndNext_whenHandle_thenThrowError() {
    const execution = RequestExecutionBusMiddlewareUnitTest.CreateExecution();

    const errorRemoteResponse = new ErrorRemoteResponse(
      'message',
      null,
      null,
      new HttpHeaders(),
      0,
      'statusText',
      'url',
    );

    when(this.adapter.execute('baseHost', anything())).thenReturn(throwError(errorRemoteResponse));

    const next = jest.fn((message: HttpExecution<unknown>) => of(message));

    const observable = subscribeSpyTo(this.SUT.handle(instance(execution), next), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedError()).toBeTruthy();
    expect(observable.getError()).toBe(errorRemoteResponse);
  }
}
