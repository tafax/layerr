import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { suite, test } from '@testdeck/jest';
import { of } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { MessageBus } from '../../../src/lib/bus/message-bus';
import { IdentityMessageTypeExtractor } from '../../../src/lib/message-handler/extractor/identity.message-type-extractor';
import { CollectionHandlerLookup } from '../../../src/lib/message-handler/handler-lookup/collection/collection.handler-lookup';
import { MessageHandlerMiddleware } from '../../../src/lib/message-handler/message-handler.middleware';
import { FunctionMessageMapper } from '../../../src/lib/message-handler/message-mapper/function.message-mapper';
import { CustomError } from '../../fixtures/custom.error';
import { EvilCommandForTest } from '../../fixtures/evil-command-for-test';
import { GoodCommandForTest } from '../../fixtures/good-command-for-test';

@suite
class FunctionCommandBusIntegrationTest {

  private SUT: MessageBus<unknown>;

  before() {
    const messageHandlingCollection = new CollectionHandlerLookup([
      {
        message: 'GoodCommandForTest',
        handler: (command: string) => {
          expect(command).toStrictEqual('GoodCommandForTest');
          return of(undefined);
        },
      },
      {
        message: 'EvilCommandForTest',
        handler: (command: string) => {
          expect(command).toStrictEqual('EvilCommandForTest');
          return throwError(new CustomError());
        },
      },
    ]);

    this.SUT = new MessageBus([
      new MessageHandlerMiddleware(
        new FunctionMessageMapper(
          messageHandlingCollection,
          new IdentityMessageTypeExtractor(),
        ),
      ),
    ]);
  }

  @test
  givenCommand_whenHandle_thenReturnObservable() {
    const command = 'GoodCommandForTest';

    const observable = subscribeSpyTo(this.SUT.handle(command));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();
    expect(observable.getLastValue()).toStrictEqual([ undefined ]);
  }

  @test
  givenCommand_whenHandle_thenThrowError() {
    const command = 'EvilCommandForTest';

    const observable = subscribeSpyTo(this.SUT.handle(command), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.getError()).toBeInstanceOf(CustomError);
  }
}


