import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { of } from 'rxjs';
import { mock, instance, when, verify } from 'ts-mockito';
import { resolvableInstance } from '../../../../../tests/index';
import { ClassResolverInterface } from '../../../../core/src/lib/resolvers/class-resolver.interface';
import { MessageBus } from '../../../src/lib/bus/message-bus';
import { FunctionConstructorMessageTypeExtractor } from '../../../src/lib/message-handler/extractor/function-constructor.message-type-extractor';
import { CollectionHandlerLookup } from '../../../src/lib/message-handler/handler-lookup/collection/collection.handler-lookup';
import { MessageHandlerMiddleware } from '../../../src/lib/message-handler/message-handler.middleware';
import { MessageMapper } from '../../../src/lib/message-handler/message-mapper/message.mapper';
import { EvilCommandClassHandlerForTest } from '../../fixtures/class-handlers/evil-command-class-handler-for-test';
import { GoodCommandClassHandlerForTest } from '../../fixtures/class-handlers/good-command-class-handler-for-test';
import { CustomError } from '../../fixtures/custom.error';
import { EvilCommandForTest } from '../../fixtures/evil-command-for-test';
import { GoodCommandForTest } from '../../fixtures/good-command-for-test';

@suite
class ClassCommandBusIntegrationTest {

  private SUT: MessageBus<unknown>;
  private classResolver: ClassResolverInterface;

  before() {

    this.classResolver = mock<ClassResolverInterface>();

    const messageHandlingCollection = new CollectionHandlerLookup([
      { message: GoodCommandForTest, handler: GoodCommandClassHandlerForTest },
      { message: EvilCommandForTest, handler: EvilCommandClassHandlerForTest },
    ]);

    this.SUT = new MessageBus([
      new MessageHandlerMiddleware(
        new MessageMapper(
          messageHandlingCollection,
          new FunctionConstructorMessageTypeExtractor(),
          instance(this.classResolver),
        ),
      ),
    ]);
  }

  @test
  givenCommand_whenHandle_thenReturnObservable() {
    const command = new GoodCommandForTest();

    when(this.classResolver.resolve(GoodCommandClassHandlerForTest)).thenReturn(new GoodCommandClassHandlerForTest());

    const observable = subscribeSpyTo(this.SUT.handle(command));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();

    verify(this.classResolver.resolve(GoodCommandClassHandlerForTest)).once();
  }

  @test
  givenCommand_whenHandle_thenExecuteHandler() {
    const command = new GoodCommandForTest();

    const commandHandler = mock(GoodCommandClassHandlerForTest);
    when(commandHandler.handle(command)).thenReturn(of(undefined));

    when(this.classResolver.resolve(GoodCommandClassHandlerForTest)).thenReturn(resolvableInstance(commandHandler));

    this.SUT.handle(command);

    verify(commandHandler.handle(command)).once();
    verify(this.classResolver.resolve(GoodCommandClassHandlerForTest)).once();
  }

  @test
  givenCommand_whenHandle_thenThrowError() {
    const command = new EvilCommandForTest();

    when(this.classResolver.resolve(EvilCommandClassHandlerForTest)).thenReturn(new EvilCommandClassHandlerForTest());

    const observable = subscribeSpyTo(this.SUT.handle(command), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.getError()).toBeInstanceOf(CustomError);

    verify(this.classResolver.resolve(EvilCommandClassHandlerForTest)).once();
  }
}


