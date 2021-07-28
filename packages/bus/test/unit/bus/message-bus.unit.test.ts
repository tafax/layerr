import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { of, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { mock, instance, when, anyFunction, verify, resetCalls } from 'ts-mockito';
import { MessageBus } from '../../../src/lib/bus/message-bus';
import { MessageBusMiddlewareInterface } from '../../../src/lib/bus/middleware/message-bus-middleware.interface';

@suite class MessageBusUnitTest {
  @test givenMiddlewares_whenGetMiddlewares_returnThem() {
    const middleware1 = mock<MessageBusMiddlewareInterface>();
    const middleware2 = mock<MessageBusMiddlewareInterface>();
    const middleware3 = mock<MessageBusMiddlewareInterface>();

    const SUT = new MessageBus([
      instance(middleware1),
      instance(middleware2),
      instance(middleware3),
    ]);
    expect(SUT.middlewares).toHaveLength(3);
  }

  @test whenGetMiddlewares_returnEmpty() {
    const SUT = new MessageBus();
    expect(SUT.middlewares).toHaveLength(0);
  }

  @test givenMiddleware_whenAppend_returnOneMoreMiddleware() {
    const middleware1 = mock<MessageBusMiddlewareInterface>();
    const middleware2 = mock<MessageBusMiddlewareInterface>();
    const middleware3 = mock<MessageBusMiddlewareInterface>();

    const SUT = new MessageBus([
      instance(middleware1),
      instance(middleware2),
    ]);
    expect(SUT.middlewares).toHaveLength(2);

    SUT.appendMiddleware(instance(middleware3));
    expect(SUT.middlewares).toHaveLength(3);
    expect(SUT.middlewares[2]).toBe(instance(middleware3));
  }

  @test givenMiddleware_whenPrepend_returnOneMoreMiddleware() {
    const middleware1 = mock<MessageBusMiddlewareInterface>();
    const middleware2 = mock<MessageBusMiddlewareInterface>();
    const middleware3 = mock<MessageBusMiddlewareInterface>();

    const SUT = new MessageBus([
      instance(middleware1),
      instance(middleware2),
    ]);
    expect(SUT.middlewares).toHaveLength(2);

    SUT.prependMiddleware(instance(middleware3));
    expect(SUT.middlewares).toHaveLength(3);
    expect(SUT.middlewares[0]).toBe(instance(middleware3));
  }

  @test givenMessage_whenHandle_thenReturnResult() {
    const middleware1 = mock<MessageBusMiddlewareInterface>();
    const middleware2 = mock<MessageBusMiddlewareInterface>();
    const middleware3 = mock<MessageBusMiddlewareInterface>();

    const SUT = new MessageBus([
      instance(middleware1),
      instance(middleware2),
      instance(middleware3),
    ]);

    when(middleware1.handle('message', anyFunction())).thenCall(
      (message: string, next: (value: string) => Observable<unknown>) => of(undefined)
        .pipe(
          concatMap(() => next(message)),
        ),
    );

    when(middleware2.handle('message', anyFunction())).thenCall(
      (message: string, next: (value: string) => Observable<unknown>) => of(undefined)
        .pipe(
          concatMap(() => next(message)),
        ),
    );

    when(middleware3.handle('message', anyFunction())).thenCall(
      (message: string, next: (value: string) => Observable<unknown>) => of(undefined)
        .pipe(
          concatMap(() => next(message)),
          map(() => 'result'),
        ),
    );

    const observable = subscribeSpyTo(SUT.handle('message'));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();
    expect(observable.getLastValue()).toStrictEqual('result');

    verify(middleware1.handle('message', anyFunction())).once();
    verify(middleware2.handle('message', anyFunction())).once();
    verify(middleware3.handle('message', anyFunction())).once();

    resetCalls(middleware1);
    resetCalls(middleware2);
    resetCalls(middleware3);

    // Verify the handle works without explicit subscribing
    const result = SUT.handle('message');

    verify(middleware1.handle('message', anyFunction())).once();
    verify(middleware2.handle('message', anyFunction())).once();
    verify(middleware3.handle('message', anyFunction())).once();

    const execution = subscribeSpyTo(result);
    expect(execution.receivedNext()).toBeTruthy();
    expect(execution.receivedComplete()).toBeTruthy();
    expect(execution.getLastValue()).toStrictEqual('result');
  }
}
