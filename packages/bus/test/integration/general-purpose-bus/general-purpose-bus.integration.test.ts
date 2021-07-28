import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { suite, test } from '@testdeck/jest';
import { of } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { MessageBus } from '../../../src/lib/bus/message-bus';
import { GeneralPurposeBusFactory } from '../../../src/lib/factory/general-purpose-bus.factory';
import Mock = jest.Mock;

@suite
class GeneralPurposeBusIntegrationTest {

  private SUT: MessageBus<unknown>;

  private handler1: Mock;
  private handler2: Mock;

  before() {

    this.handler1 = jest.fn();
    this.handler2 = jest.fn();

    const mapping = [
      { message: 'message1', handler: this.handler1 },
      { message: 'message2', handler: this.handler2 },
    ];

    this.SUT = GeneralPurposeBusFactory.Create(mapping);
  }

  @test
  givenMessage_whenHandle_thenExecuteHandler() {
    this.handler1.mockImplementation((message: string) => {
      expect(message).toStrictEqual('message1');
      return of(undefined);
    });

    const observable = subscribeSpyTo(this.SUT.handle('message1'));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();

    expect(this.handler1.mock.calls).toHaveLength(1);
  }

  @test
  givenMessage_whenHandle_thenExecuteHandlerWithoutSubscribing() {
    this.handler2.mockImplementation((message: string) => {
      expect(message).toStrictEqual('message2');
      return of(undefined);
    });

    this.SUT.handle('message2');

    expect(this.handler2.mock.calls).toHaveLength(1);
  }

  @test
  givenMessage_whenHandle_thenThrowError() {
    this.handler1.mockImplementation((message: string) => {
      expect(message).toStrictEqual('message1');
      return throwError(new Error('handler'));
    });

    const observable = subscribeSpyTo(this.SUT.handle('message1'), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.getError().message).toStrictEqual('handler');

    expect(this.handler1.mock.calls).toHaveLength(1);
  }
}


