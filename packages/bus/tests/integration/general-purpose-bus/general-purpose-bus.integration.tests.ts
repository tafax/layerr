
import { suite, test, Mock, IMock, Times } from '@layerr/test';
import { MessageBus } from '../../../src/bus/message-bus';
import { GeneralPurposeBusFactory } from '../../../src/factory/general-purpose-bus.factory';

//@ts-ignore
@suite class GeneralPurposeBusIntegrationTests {

  private messageBus: MessageBus<any>;

  private handler1Mock: IMock<Function>;
  private handler2Mock: IMock<Function>;

  before() {

    this.handler1Mock = Mock.ofType<Function>();
    this.handler2Mock = Mock.ofType<Function>();

    const mapping = [
      { message: 'message1', handler: this.handler1Mock.object },
      { message: 'message2', handler: this.handler2Mock.object },
    ];

    this.messageBus = GeneralPurposeBusFactory.Create(mapping);
  }

  @test 'should execute the correct command handler'() {

    this.handler1Mock
      .setup(x => x('message1'))
      .verifiable(Times.once());

    return this.messageBus.handle('message1')
      .subscribe(
        () => {
          this.handler1Mock.verifyAll();
        }
      );
  }

  @test 'should execute the correct command handler without subscribing'() {

    this.handler2Mock
      .setup(x => x('message2'))
      .verifiable(Times.once());

    const execution$ = this.messageBus.handle('message2');

    this.handler2Mock.verifyAll();

    return execution$.subscribe();
  }

  @test 'should execute the correct command handler and throws error'() {

    this.handler1Mock
      .setup(x => x('message1'))
      .throws(new Error('handler'))
      .verifiable(Times.once());

    return this.messageBus.handle('message1')
      .subscribe(
        () => { throw new Error('should-not-be-called'); },
        (error: Error) => {

          error.message.should.be.eql('handler');
          this.handler1Mock.verifyAll();

        }
      );
  }
}


