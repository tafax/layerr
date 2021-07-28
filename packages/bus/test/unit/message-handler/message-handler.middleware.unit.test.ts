import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { jest, expect } from '@jest/globals';
import { suite, test, params } from '@testdeck/jest';
import { of, Observable } from 'rxjs';
import { mock, instance, when } from 'ts-mockito';
import { MessageHandlerMiddleware } from '../../../src/lib/message-handler/message-handler.middleware';
import { MessageMapperInterface } from '../../../src/lib/message-handler/message-mapper/message-mapper.interface';

@suite
class MessageHandlerMiddlewareUnitTest {

  private SUT: MessageHandlerMiddleware;
  private messageMapper: MessageMapperInterface;

  before() {
    this.messageMapper = mock<MessageMapperInterface>();

    this.SUT = new MessageHandlerMiddleware(
      instance(this.messageMapper),
    );
  }

  private static Provider(): [ string, (message: string) => Observable<unknown>, Function ][] {
    return [
      [
        'message',
        (message: string) => of(`${message}:next-result`),
        () => of('handler-result'),
      ],
      [
        'message',
        (message: string) => of(`${message}:next-result`),
        () => ('handler-result'),
      ],
      [
        'message',
        (message: string) => of(`${message}:next-result`),
        () => new Promise((resolve => { resolve('handler-result'); })),
      ],
    ];
  }

  @params(MessageHandlerMiddlewareUnitTest.Provider()[0])
  @params(MessageHandlerMiddlewareUnitTest.Provider()[1])
  // TODO: Unable to test the promise
  //@params(MessageHandlerMiddlewareUnitTest.Provider()[2])
  @test
  givenMessageAndNext_whenHandle_thenReturnNextResult([ message, next, handler ]: [ string, (message: string) => Observable<unknown>, Function ]) {
    when(this.messageMapper.getHandlers(message)).thenReturn([ handler ]);

    const observable = subscribeSpyTo(this.SUT.handle(message, next));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();
    expect(observable.getLastValue()).toStrictEqual('handler-result:next-result');
  }

  @test
  givenMessageAndNext_whenHandle_thenReturnNextResultFromPromise(done) {
    const [ message, next, handler ] = [
      'message',
      (message: string) => of(`${message}:next-result`),
      () => new Promise((resolve => { resolve('handler-result'); })),
    ];
    when(this.messageMapper.getHandlers(message)).thenReturn([ handler ]);

    this.SUT.handle(message, next)
      .subscribe(
        (result: string) => {
          expect(result).toStrictEqual('handler-result:next-result');
          done();
        },
      );
  }
}
