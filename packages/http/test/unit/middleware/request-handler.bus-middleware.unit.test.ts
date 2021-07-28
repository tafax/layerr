import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { suite, test } from '@testdeck/jest';
import { of } from 'rxjs';
import { mock, instance, when, anything, verify, capture } from 'ts-mockito';
import { resolvableInstance } from '../../../../../tests/index';
import { MessageMapperInterface } from '../../../../bus/src/lib/message-handler/message-mapper/message-mapper.interface';
import { JsonType } from '../../../../core/src/lib/utilities/json-type';
import { HttpLayerrError } from '../../../src/lib/error/http-layerr.error';
import { HttpExecution } from '../../../src/lib/http-execution';
import { RequestHandlerBusMiddleware } from '../../../src/lib/middleware/request-handler.bus-middleware';
import { RequestInterface } from '../../../src/lib/request/request.interface';
import { RemoteResponse } from '../../../src/lib/response/remote-response';

@suite
class RequestHandlerBusMiddlewareUnitTest {

  private SUT: RequestHandlerBusMiddleware;
  private messageMapper: MessageMapperInterface;

  before() {
    this.messageMapper = mock<MessageMapperInterface>();
    this.SUT = new RequestHandlerBusMiddleware(
      instance(this.messageMapper),
    );
  }

  private static CreateExecution(): HttpExecution<unknown> {
    const execution = mock<HttpExecution<unknown>>();

    const request = mock<RequestInterface>();
    const response = mock<RemoteResponse<JsonType>>();

    when(execution.baseHost).thenReturn('baseHost');
    when(execution.request).thenReturn(resolvableInstance(request));
    when(execution.response).thenReturn(resolvableInstance(response));

    when(execution.hasResponse()).thenReturn(true);
    when(execution.clone(anything())).thenReturn(resolvableInstance(execution));
    return execution;
  }

  @test
  givenExecutionAndNext_whenHandle_thenSetContent() {
    const execution = RequestHandlerBusMiddlewareUnitTest.CreateExecution();

    const next = jest.fn((message: HttpExecution<unknown>) => of(message));

    const handler = jest.fn(() => of({ body: 'body' }));
    when(this.messageMapper.getHandlers(instance(execution).request)).thenReturn([ handler ]);

    const observable = subscribeSpyTo(this.SUT.handle(instance(execution), next));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();

    const [ args ] = capture(execution.clone).last();
    expect(args.content).toStrictEqual({ body: 'body' });
  }

  @test
  givenExecutionAndNext_whenHandle_thenCallNextMiddleware() {
    const execution = RequestHandlerBusMiddlewareUnitTest.CreateExecution();

    const next = jest.fn((message: HttpExecution<unknown>) => of(message));

    when(this.messageMapper.getHandlers(instance(execution).request)).thenReturn([]);

    const observable = subscribeSpyTo(this.SUT.handle(resolvableInstance(execution), next));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();

    verify(execution.clone(anything())).never();
  }

  @test
  givenExceptionWithNoResponseAndNext_whenHandle_thenThrowError() {
    const execution = mock<HttpExecution<unknown>>();
    const request = mock<RequestInterface>();
    when(request.clone(anything())).thenReturn(resolvableInstance(request));
    when(execution.request).thenReturn(resolvableInstance(request));

    const next = (message: HttpExecution<unknown>) => of(message);

    expect(() => this.SUT.handle(instance(execution), next)).toThrow(HttpLayerrError);
  }
}
