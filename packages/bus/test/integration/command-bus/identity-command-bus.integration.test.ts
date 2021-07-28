import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { of } from 'rxjs';
import { mock, instance, when, verify } from 'ts-mockito';
import { resolvableInstance } from '../../../../../tests/index';
import { ClassResolverInterface } from '../../../../core/src/lib/resolvers/class-resolver.interface';
import { MessageBus } from '../../../src/lib/bus/message-bus';
import { IdentityMessageTypeExtractor } from '../../../src/lib/message-handler/extractor/identity.message-type-extractor';
import { CollectionHandlerLookup } from '../../../src/lib/message-handler/handler-lookup/collection/collection.handler-lookup';
import { MessageHandlerMiddleware } from '../../../src/lib/message-handler/message-handler.middleware';
import { MessageMapper } from '../../../src/lib/message-handler/message-mapper/message.mapper';
import { CustomError } from '../../fixtures/custom.error';
import { EvilCommandForTest } from '../../fixtures/evil-command-for-test';
import { GoodCommandForTest } from '../../fixtures/good-command-for-test';
import { EvilCommandStringHandlerForTest } from '../../fixtures/string-handlers/evil-command-handler-for-test';
import { GoodCommandStringHandlerForTest } from '../../fixtures/string-handlers/good-command-handler-for-test';

@suite
class IdentityCommandBusIntegrationTest {

  private SUT: MessageBus<unknown>;
  private classResolver: ClassResolverInterface;

  before() {
    this.classResolver = mock<ClassResolverInterface>();

    const messageHandlingCollection = new CollectionHandlerLookup([
      { message: 'GoodCommandForTest', handler: GoodCommandStringHandlerForTest },
      { message: 'EvilCommandForTest', handler: EvilCommandStringHandlerForTest },
    ]);

    this.SUT = new MessageBus([
      new MessageHandlerMiddleware(
        new MessageMapper(
          messageHandlingCollection,
          new IdentityMessageTypeExtractor(),
          instance(this.classResolver),
        ),
      ),
    ]);
  }

  @test
  givenCommand_whenHandle_thenReturnObservable() {
    const command = 'GoodCommandForTest';

    when(this.classResolver.resolve(GoodCommandStringHandlerForTest)).thenReturn(new GoodCommandStringHandlerForTest());

    const observable = subscribeSpyTo(this.SUT.handle(command));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();

    verify(this.classResolver.resolve(GoodCommandStringHandlerForTest)).once();
  }

  @test
  givenCommand_whenHandle_thenExecuteHandler() {
    const command = 'GoodCommandForTest';

    const commandHandler = mock(GoodCommandStringHandlerForTest);
    when(commandHandler.handle(command)).thenReturn(of(undefined));

    when(this.classResolver.resolve(GoodCommandStringHandlerForTest)).thenReturn(resolvableInstance(commandHandler));

    this.SUT.handle(command);

    verify(this.classResolver.resolve(GoodCommandStringHandlerForTest)).once();
    verify(commandHandler.handle(command)).once();
  }

  @test
  givenCommand_whenHandle_thenThrowError() {
    const command = 'EvilCommandForTest';

    when(this.classResolver.resolve(EvilCommandStringHandlerForTest)).thenReturn(new EvilCommandStringHandlerForTest());

    const observable = subscribeSpyTo(this.SUT.handle(command), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.getError()).toBeInstanceOf(CustomError);

    verify(this.classResolver.resolve(EvilCommandStringHandlerForTest)).once();
  }
}


