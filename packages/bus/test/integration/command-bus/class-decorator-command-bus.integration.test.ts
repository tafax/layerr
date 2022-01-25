import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { suite, test } from '@testdeck/jest';
import { of, Observable, throwError } from 'rxjs';
import { mock, instance, when, verify } from 'ts-mockito';
import { ClassResolverInterface } from '../../../../core/src/lib/resolvers/class-resolver.interface';
import { MessageBus } from '../../../src/lib/bus/message-bus';
import { Handle } from '../../../src/lib/decorator/handle';
import { FunctionConstructorMessageTypeExtractor } from '../../../src/lib/message-handler/extractor/function-constructor.message-type-extractor';
import { ClassDecoratorHandlerLookup } from '../../../src/lib/message-handler/handler-lookup/decorator/class-decorator.handler-lookup';
import { MessageHandlerMiddleware } from '../../../src/lib/message-handler/message-handler.middleware';
import { MessageMapper } from '../../../src/lib/message-handler/message-mapper/message.mapper';
import { CustomError } from '../../fixtures/custom.error';

class Message {}

@Handle(Message)
class MessageHandler {
  handle(): Observable<void> {
    return of(undefined);
  }
}

class EvilMessage {}

@Handle(EvilMessage)
class EvilMessageHandler {
  handle(): Observable<void> {
    return throwError(new CustomError());
  }
}

@suite
class ClassDecoratorCommandBusIntegrationTest {

  private SUT: MessageBus<unknown>;
  private classResolver: ClassResolverInterface;

  before() {
    this.classResolver = mock<ClassResolverInterface>();

    this.SUT = new MessageBus([
      new MessageHandlerMiddleware(
        new MessageMapper(
          new ClassDecoratorHandlerLookup(),
          new FunctionConstructorMessageTypeExtractor(),
          instance(this.classResolver),
        ),
      ),
    ]);
  }

  @test
  givenCommand_whenHandle_thenReturnObservable() {
    const command = new Message();

    when(this.classResolver.resolve(MessageHandler)).thenReturn(new MessageHandler());

    const observable = subscribeSpyTo(this.SUT.handle(command));
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.receivedComplete()).toBeTruthy();

    verify(this.classResolver.resolve(MessageHandler)).once();
  }

  @test
  givenCommand_whenHandle_thenThrowError() {
    const command = new EvilMessage();

    when(this.classResolver.resolve(EvilMessageHandler)).thenReturn(new EvilMessageHandler());

    const observable = subscribeSpyTo(this.SUT.handle(command), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.getError()).toBeInstanceOf(CustomError);
  }
}


