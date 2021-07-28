import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { suite, test } from '@testdeck/jest';
import { of } from 'rxjs';
import { mock, instance, when, verify, deepEqual } from 'ts-mockito';
import { resolvableInstance } from '../../../../../tests/index';
import { MessageTypeExtractorInterface } from '../../../../bus/src/lib/message-handler/extractor/message-type-extractor.interface';
import { HttpLayerrError } from '../../../src/lib/error/http-layerr.error';
import { HttpLayerrErrorType } from '../../../src/lib/error/http-layerr.error-type';
import { HttpExecution } from '../../../src/lib/http-execution';
import { HttpBackendDecoratorResolver } from '../../../src/lib/middleware/http-backend/decorator/http-backend.decorator-resolver';
import { HttpBackendBusMiddleware } from '../../../src/lib/middleware/http-backend/http-backend.bus-middleware';
import { RequestInterface } from '../../../src/lib/request/request.interface';
import { TestRequest } from '../../fixtures/test.request';

@suite
class HttpBackendBusMiddlewareUnitTest {

  private SUT: HttpBackendBusMiddleware<string>;
  private extractor: MessageTypeExtractorInterface;
  private resolver: HttpBackendDecoratorResolver<string>;

  before() {
    this.extractor = mock<MessageTypeExtractorInterface>();
    this.resolver = mock<HttpBackendDecoratorResolver<string>>();

    this.SUT = new HttpBackendBusMiddleware(
      [
        [ 'ADMIN', 'api.admin' ],
        [ 'PUBLIC', 'api.public' ],
        [ 'NULL', null ],
      ],
      instance(this.extractor),
      instance(this.resolver),
    );
  }

  private static CreateExecution(): HttpExecution<unknown> {
    const execution = mock<HttpExecution<unknown>>();
    const request = mock<RequestInterface>();
    when(execution.request).thenReturn(resolvableInstance(request));
    return execution;
  }

  @test
  givenExecutionAndNext_whenHandle_thenUpdateMessageWithBaseHost() {
    const execution = HttpBackendBusMiddlewareUnitTest.CreateExecution();

    when(this.extractor.extract(instance(execution).request)).thenReturn(TestRequest);
    when(this.resolver.getValue(TestRequest)).thenReturn('ADMIN');

    const next = jest.fn((message: HttpExecution<unknown>) => of(message));

    when(execution.clone(deepEqual({ baseHost: 'api.admin' }))).thenReturn(resolvableInstance(execution));
    when(execution.baseHost).thenReturn('api.admin');

    const observable = subscribeSpyTo(this.SUT.handle(instance(execution), next));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();

    const message = observable.getLastValue();
    expect(message.baseHost).toStrictEqual('api.admin');

    verify(execution.clone(deepEqual({ baseHost: 'api.admin' }))).once();
  }

  @test
  givenExecutionWithRequestForNotDefinedKeyAndNext_whenHandle_thenThrowError() {
    const execution = HttpBackendBusMiddlewareUnitTest.CreateExecution();

    when(this.extractor.extract(instance(execution).request)).thenReturn(TestRequest);
    when(this.resolver.getValue(TestRequest)).thenReturn('NOT_DEFINED');

    const next = jest.fn((message: HttpExecution<unknown>) => of(message));

    const observable = subscribeSpyTo(this.SUT.handle(instance(execution), next), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.receivedError()).toBeTruthy();

    expect(observable.getError()).toBeInstanceOf(HttpLayerrError);

    const error = observable.getError();
    expect(error.message).toStrictEqual('Backend key "NOT_DEFINED" doesn\'t exists.');
    expect(error.type).toStrictEqual(HttpLayerrErrorType.INTERNAL);
    expect(error.request).toBe(instance(execution).request);
    expect(error.status).toBeNull();
    expect(error.statusText).toBeNull();
    expect(error.original).toBeNull();
    expect(error.errorContent).toBeNull();
  }

  @test
  givenExecutionWithRequestForInvalidHostAndNext_whenHandle_thenThrowError() {
    const execution = HttpBackendBusMiddlewareUnitTest.CreateExecution();

    when(this.extractor.extract(instance(execution).request)).thenReturn(TestRequest);
    when(this.resolver.getValue(TestRequest)).thenReturn('NULL');

    const next = jest.fn((message: HttpExecution<unknown>) => of(message));

    const observable = subscribeSpyTo(this.SUT.handle(instance(execution), next), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.receivedError()).toBeTruthy();

    expect(observable.getError()).toBeInstanceOf(HttpLayerrError);

    const error = observable.getError();
    expect(error.message).toStrictEqual('Backend key "NULL" points to a not valid base host.');
    expect(error.type).toStrictEqual(HttpLayerrErrorType.INTERNAL);
    expect(error.request).toBe(instance(execution).request);
    expect(error.status).toBeNull();
    expect(error.statusText).toBeNull();
    expect(error.original).toBeNull();
    expect(error.errorContent).toBeNull();
  }
}
