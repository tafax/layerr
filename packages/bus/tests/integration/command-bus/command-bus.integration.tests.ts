
import { ClassResolverInterface } from '@layerr/core';
import { suite, test, Mock, IMock, Times } from '@layerr/test';
import { of } from 'rxjs';
import {
  MessageMapper,
  CollectionHandlerLookup,
  FunctionConstructorMessageTypeExtractor,
  MessageBus,
  MessageHandlerMiddleware
} from '../../..';
import { CustomError } from '../../fixtures/custom.error';
import { EvilCommandForTest } from '../../fixtures/evil-command-for-test';
import { EvilCommandClassHandlerForTest } from '../../fixtures/class-handlers/evil-command-class-handler-for-test';
import { GoodCommandForTest } from '../../fixtures/good-command-for-test';
import { GoodCommandClassHandlerForTest } from '../../fixtures/class-handlers/good-command-class-handler-for-test';
import { IdentityMessageTypeExtractor } from '../../../src/message-handler/extractor/identity.message-type-extractor';
import { NameMessageTypeExtractor } from '../../../src/message-handler/extractor/name.message-type-extractor';
import { throwError } from 'rxjs/internal/observable/throwError';
import { GoodCommandStringHandlerForTest } from '../../fixtures/string-handlers/good-command-handler-for-test';
import { EvilCommandStringHandlerForTest } from '../../fixtures/string-handlers/evil-command-handler-for-test';
import { FunctionMessageMapper } from '../../../src/message-handler/message-mapper/function.message-mapper';
import { MethodMessageMapper } from '../../../src/message-handler/message-mapper/method.message-mapper';

//@ts-ignore
@suite class CommandBusIntegrationTests {

  private classCommandBus: MessageBus<any>;
  private identityCommandBus: MessageBus<any>;
  private nameCommandBus: MessageBus<any>;
  private functionCommandBus: MessageBus<any>;
  private methodCommandBus: MessageBus<any>;

  private classResolverMock: IMock<ClassResolverInterface>;

  before() {

    this.classResolverMock = Mock.ofType<ClassResolverInterface>();

    const classMessageHandlingCollection = new CollectionHandlerLookup([
      { message: GoodCommandForTest, handler: GoodCommandClassHandlerForTest },
      { message: EvilCommandForTest, handler: EvilCommandClassHandlerForTest }
    ]);

    const identityMessageHandlingCollection = new CollectionHandlerLookup([
      { message: 'GoodCommandForTest', handler: GoodCommandStringHandlerForTest },
      { message: 'EvilCommandForTest', handler: EvilCommandStringHandlerForTest }
    ]);

    const nameMessageHandlingCollection = new CollectionHandlerLookup([
      { message: 'GoodCommandForTest', handler: GoodCommandClassHandlerForTest },
      { message: 'EvilCommandForTest', handler: EvilCommandClassHandlerForTest }
    ]);

    const functionMessageHandlingCollection = new CollectionHandlerLookup([
      {
        message: 'GoodCommandForTest',
        handler: (command: string) => {
          command.should.be.eql('GoodCommandForTest');
          return of(undefined);
        }
      },
      {
        message: 'EvilCommandForTest',
        handler: (command: string) => {
          command.should.be.eql('EvilCommandForTest');
          return throwError(new CustomError());
        }
      }
    ]);

    const methodMessageHandlingCollection = new CollectionHandlerLookup([
      {
        message: GoodCommandForTest,
        handler: [
          GoodCommandClassHandlerForTest,
          'applyCommand'
        ]
      },
      {
        message: EvilCommandForTest,
        handler: [
          EvilCommandClassHandlerForTest,
          'applyCommand'
        ]
      }
    ]);

    const functionExtractor = new FunctionConstructorMessageTypeExtractor();
    const identityExtractor = new IdentityMessageTypeExtractor();
    const nameExtractor = new NameMessageTypeExtractor();

    this.classCommandBus = new MessageBus([
      new MessageHandlerMiddleware(
        new MessageMapper(
          classMessageHandlingCollection,
          functionExtractor,
          this.classResolverMock.object
        )
      )
    ]);

    this.identityCommandBus = new MessageBus([
      new MessageHandlerMiddleware(
        new MessageMapper(
          identityMessageHandlingCollection,
          identityExtractor,
          this.classResolverMock.object
        )
      )
    ]);

    this.nameCommandBus = new MessageBus([
      new MessageHandlerMiddleware(
        new MessageMapper(
          nameMessageHandlingCollection,
          nameExtractor,
          this.classResolverMock.object
        )
      )
    ]);

    this.functionCommandBus = new MessageBus([
      new MessageHandlerMiddleware(
        new FunctionMessageMapper(
          functionMessageHandlingCollection,
          identityExtractor
        )
      )
    ]);

    this.methodCommandBus = new MessageBus([
      new MessageHandlerMiddleware(
        new MethodMessageMapper(
          methodMessageHandlingCollection,
          functionExtractor,
          this.classResolverMock.object
        )
      )
    ]);
  }

  @test 'should execute the correct command handler - CLASS'() {

    const command = new GoodCommandForTest();

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandClassHandlerForTest))
      .returns(() => new GoodCommandClassHandlerForTest())
      .verifiable(Times.once());

    return this.classCommandBus.handle(command)
      .subscribe(
        () => {
          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler - IDENTITY'() {

    const command = 'GoodCommandForTest';

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandStringHandlerForTest))
      .returns(() => new GoodCommandStringHandlerForTest())
      .verifiable(Times.once());

    return this.identityCommandBus.handle(command)
      .subscribe(
        () => {
          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler - NAME'() {

    const command = new GoodCommandForTest();

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandClassHandlerForTest))
      .returns(() => new GoodCommandClassHandlerForTest())
      .verifiable(Times.once());

    return this.nameCommandBus.handle(command)
      .subscribe(
        () => {
          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler - FUNCTION'() {

    const command = 'GoodCommandForTest';

    return this.functionCommandBus.handle(command).subscribe();
  }

  @test 'should execute the correct command handler - METHOD'() {

    const command = new GoodCommandForTest();

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandClassHandlerForTest))
      .returns(() => new GoodCommandClassHandlerForTest())
      .verifiable(Times.once());

    return this.methodCommandBus.handle(command)
      .subscribe(
        () => {
          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler without subscribing - CLASS'() {

    const command = new GoodCommandForTest();

    const commandHandlerMock = Mock.ofType(GoodCommandClassHandlerForTest);

    commandHandlerMock
      .setup(x => x.handle(command))
      .returns(() => of(undefined))
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandClassHandlerForTest))
      .returns(() => commandHandlerMock.object)
      .verifiable(Times.once());

    const execution$ = this.classCommandBus.handle(command);

    this.classResolverMock.verifyAll();
    commandHandlerMock.verifyAll();

    return execution$
      .subscribe(() => {
        this.classResolverMock.verifyAll();
        commandHandlerMock.verifyAll();
      });
  }

  @test 'should execute the correct command handler without subscribing - IDENTITY'() {

    const command = 'GoodCommandForTest';

    const commandHandlerMock = Mock.ofType(GoodCommandStringHandlerForTest);

    commandHandlerMock
      .setup(x => x.handle(command))
      .returns(() => of(undefined))
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandStringHandlerForTest))
      .returns(() => commandHandlerMock.object)
      .verifiable(Times.once());

    const execution$ = this.identityCommandBus.handle(command);

    this.classResolverMock.verifyAll();
    commandHandlerMock.verifyAll();

    return execution$
      .subscribe(() => {
        this.classResolverMock.verifyAll();
        commandHandlerMock.verifyAll();
      });
  }

  @test 'should execute the correct command handler without subscribing - NAME'() {

    const command = new GoodCommandForTest();

    const commandHandlerMock = Mock.ofType(GoodCommandClassHandlerForTest);

    commandHandlerMock
      .setup(x => x.handle(command))
      .returns(() => of(undefined))
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandClassHandlerForTest))
      .returns(() => commandHandlerMock.object)
      .verifiable(Times.once());

    const execution$ = this.nameCommandBus.handle(command);

    this.classResolverMock.verifyAll();
    commandHandlerMock.verifyAll();

    return execution$
      .subscribe(() => {
        this.classResolverMock.verifyAll();
        commandHandlerMock.verifyAll();
      });
  }

  @test 'should execute the correct command handler without subscribing - FUNCTION'() {

    const command = 'GoodCommandForTest';

    return this.functionCommandBus.handle(command).subscribe();
  }

  @test 'should execute the correct command handler without subscribing - METHOD'() {

    const command = new GoodCommandForTest();

    const commandHandlerMock = Mock.ofType(GoodCommandClassHandlerForTest);

    commandHandlerMock
      .setup(x => x.applyCommand(command))
      .returns(() => of(undefined))
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(GoodCommandClassHandlerForTest))
      .returns(() => commandHandlerMock.object)
      .verifiable(Times.once());

    const execution$ = this.methodCommandBus.handle(command);

    this.classResolverMock.verifyAll();
    commandHandlerMock.verifyAll();

    return execution$
      .subscribe(() => {
        this.classResolverMock.verifyAll();
        commandHandlerMock.verifyAll();
      });
  }

  @test 'should execute the correct command handler and throws error - CLASS'() {

    const command = new EvilCommandForTest();

    this.classResolverMock
      .setup(x => x.resolve(EvilCommandClassHandlerForTest))
      .returns(() => new EvilCommandClassHandlerForTest())
      .verifiable(Times.once());

    return this.classCommandBus.handle(command)
      .subscribe(
        () => { throw new Error('should-not-be-called'); },
        (error: Error) => {
          error.should.be.instanceof(CustomError);

          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler and throws error - IDENTITY'() {

    const command = 'EvilCommandForTest';

    this.classResolverMock
      .setup(x => x.resolve(EvilCommandStringHandlerForTest))
      .returns(() => new EvilCommandStringHandlerForTest())
      .verifiable(Times.once());

    return this.identityCommandBus.handle(command)
      .subscribe(
        () => { throw new Error('should-not-be-called'); },
        (error: Error) => {
          error.should.be.instanceof(CustomError);

          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler and throws error - NAME'() {

    const command = new EvilCommandForTest();

    this.classResolverMock
      .setup(x => x.resolve(EvilCommandClassHandlerForTest))
      .returns(() => new EvilCommandClassHandlerForTest())
      .verifiable(Times.once());

    return this.nameCommandBus.handle(command)
      .subscribe(
        () => { throw new Error('should-not-be-called'); },
        (error: Error) => {
          error.should.be.instanceof(CustomError);

          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler and throws error - FUNCTION'() {

    const command = 'EvilCommandForTest';

    return this.functionCommandBus.handle(command)
      .subscribe(
        () => { throw new Error('should-not-be-called'); },
        (error: Error) => {
          error.should.be.instanceof(CustomError);

          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler and throws error - METHOD'() {

    const command = new EvilCommandForTest();

    this.classResolverMock
      .setup(x => x.resolve(EvilCommandClassHandlerForTest))
      .returns(() => new EvilCommandClassHandlerForTest())
      .verifiable(Times.once());

    return this.methodCommandBus.handle(command)
      .subscribe(
        () => { throw new Error('should-not-be-called'); },
        (error: Error) => {
          error.should.be.instanceof(CustomError);

          this.classResolverMock.verifyAll();
        }
      );
  }

}


