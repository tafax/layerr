
import { ClassResolverInterface } from '@swiss/core';
import { suite, test, Mock, IMock, Times } from '@swiss/test';
import { of } from 'rxjs';
import {
  MessageMapper,
  CollectionHandlerLookup,
  FunctionConstructorMessageTypeExtractor,
  MessageBus,
  MessageHandlerMiddleware
} from '../../..';
import { CustomError } from '../../fixtures/custom.error';
import { EviCommandForTest } from '../../fixtures/evi-command-for-test';
import { EvilCommandHandlerForTest } from '../../fixtures/evil-command-handler-for-test';
import { GoodCommandForTest } from '../../fixtures/good-command-for-test';
import { GoodCommandHandlerForTest } from '../../fixtures/good-command-handler-for-test';

//@ts-ignore
@suite class CommandBusIntegrationTests {

  private commandBus: MessageBus<any>;
  private classResolverMock: IMock<ClassResolverInterface>;

  before() {

    this.classResolverMock = Mock.ofType<ClassResolverInterface>();

    const messageHandlingCollection = new CollectionHandlerLookup([
      { message: GoodCommandForTest, handler: GoodCommandHandlerForTest },
      { message: EviCommandForTest, handler: EvilCommandHandlerForTest }
    ]);

    const functionExtractor = new FunctionConstructorMessageTypeExtractor();

    const messageMapper = new MessageMapper(
      messageHandlingCollection,
      functionExtractor,
      this.classResolverMock.object
    );

    this.commandBus = new MessageBus([
      new MessageHandlerMiddleware(messageMapper)
    ]);
  }

  @test 'should execute the correct command handler'() {

    const command = new GoodCommandForTest();

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandHandlerForTest))
      .returns(() => new GoodCommandHandlerForTest())
      .verifiable(Times.once());

    return this.commandBus.handle(command)
      .subscribe(
        () => {
          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler without subscribing'() {

    const command = new GoodCommandForTest();

    const commandHandlerMock = Mock.ofType(GoodCommandHandlerForTest);

    commandHandlerMock
      .setup(x => x.handle(command))
      .returns(() => of(undefined))
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandHandlerForTest))
      .returns(() => commandHandlerMock.object)
      .verifiable(Times.once());

    const execution$ = this.commandBus.handle(command);

    this.classResolverMock.verifyAll();
    commandHandlerMock.verifyAll();

    return execution$
      .subscribe(() => {
        this.classResolverMock.verifyAll();
        commandHandlerMock.verifyAll();
      });
  }

  @test 'should execute the correct command handler and throws error'() {

    const command = new EviCommandForTest();

    this.classResolverMock
      .setup(x => x.resolve(EvilCommandHandlerForTest))
      .returns(() => new EvilCommandHandlerForTest())
      .verifiable(Times.once());

    return this.commandBus.handle(command)
      .subscribe(
        () => { throw new Error('should-not-be-called'); },
        (error: Error) => {
          error.should.be.instanceof(CustomError);

          this.classResolverMock.verifyAll();
        }
      );
  }
}


