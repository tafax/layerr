
import { suite, test, IMock, Mock, Times, It } from '@swiss/test';
import { of } from 'rxjs';
import { MessageHandlerMiddleware, MessageMapperInterface } from '../../../src/public_api';

//@ts-ignore
@suite class MessageHandlerMiddlewareUnitTests {

  private messageHandlerMiddleware: MessageHandlerMiddleware;
  private messageMapperMock: IMock<MessageMapperInterface>;

  before() {

    this.messageMapperMock = Mock.ofType<MessageMapperInterface>();

    this.messageHandlerMiddleware = new MessageHandlerMiddleware(
      this.messageMapperMock.object
    );
  }

  @test 'should resolve the handlers if observables - Message Handler'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x([ 'handler-resolved' ]))
      .returns((value: string[]) => of(value))
      .verifiable(Times.once());

    const handlerMock = Mock.ofType<any>();
    handlerMock
      .setup(x => x.handle(message))
      .returns(() => of('handler-resolved'))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock.object.handle.bind(handlerMock.object) ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe((result: string) => {

        result.should.be.eql([ 'handler-resolved' ]);

        handlerMock.verifyAll();
        nextMock.verifyAll();
      });
  }

  @test 'should resolve the handlers if observables - Function'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x([ 'handler1-resolved', 'handler2-resolved' ]))
      .returns((value: string[]) => of(value))
      .verifiable(Times.once());

    const handlerMock1 = Mock.ofType(Function);
    handlerMock1
      .setup(x => x(message))
      .returns(() => of('handler1-resolved'))
      .verifiable(Times.once());

    const handlerMock2 = Mock.ofType(Function);
    handlerMock2
      .setup(x => x(message))
      .returns(() => of('handler2-resolved'))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock1.object, handlerMock2.object ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe((result: string) => {

        result.should.be.eql([ 'handler1-resolved', 'handler2-resolved' ]);

        handlerMock1.verifyAll();
        handlerMock2.verifyAll();
        nextMock.verifyAll();
      });
  }

  @test 'should resolve the handlers if not observables - Message Handler'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x([ 'handler-resolved' ]))
      .returns((value: string[]) => of(value))
      .verifiable(Times.once());

    const handlerMock = Mock.ofType<any>();
    handlerMock
      .setup(x => x.handle(message))
      .returns(() => 'handler-resolved')
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock.object.handle.bind(handlerMock.object) ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe(() => {
        handlerMock.verifyAll();
        nextMock.verifyAll();
      });
  }

  @test 'should resolve the handlers if not observables - Function'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x([ 'handler1-resolved', 'handler2-resolved' ]))
      .returns((value: string[]) => of(value))
      .verifiable(Times.once());

    const handlerMock1 = Mock.ofType(Function);
    handlerMock1
      .setup(x => x(message))
      .returns(() => 'handler1-resolved')
      .verifiable(Times.once());

    const handlerMock2 = Mock.ofType(Function);
    handlerMock2
      .setup(x => x(message))
      .returns(() => of('handler2-resolved'))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock1.object, handlerMock2.object ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe(() => {
        handlerMock1.verifyAll();
        handlerMock2.verifyAll();
        nextMock.verifyAll();
      });
  }

  @test 'should resolve the handlers if promises - Message Handler'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x([ 'handler-resolved' ]))
      .returns((value: string[]) => of(value))
      .verifiable(Times.once());

    const handlerMock = Mock.ofType<any>();
    handlerMock
      .setup(x => x.handle(message))
      .returns(() => Promise.resolve('handler-resolved'))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock.object.handle.bind(handlerMock.object) ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe(() => {
        handlerMock.verifyAll();
        nextMock.verifyAll();
      });
  }

  @test 'should resolve the handlers if promises - Function'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x([ 'handler2-resolved', 'handler1-resolved' ]))
      .returns((value: string[]) => of(value))
      .verifiable(Times.once());

    const handlerMock1 = Mock.ofType(Function);
    handlerMock1
      .setup(x => x(message))
      .returns(() => Promise.resolve('handler1-resolved'))
      .verifiable(Times.once());

    const handlerMock2 = Mock.ofType(Function);
    handlerMock2
      .setup(x => x(message))
      .returns(() => of('handler2-resolved'))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock1.object, handlerMock2.object, ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe(() => {
        handlerMock1.verifyAll();
        handlerMock2.verifyAll();
        nextMock.verifyAll();
      });
  }

  @test 'should resolve the handlers if not observables and return the handle value - Message Handler'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x([ 'handler-resolved' ]))
      .returns((value: string[]) => of(value))
      .verifiable(Times.once());

    const handlerMock = Mock.ofType<any>();
    handlerMock
      .setup(x => x.handle(message))
      .returns(() => 'handler-resolved')
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock.object.handle.bind(handlerMock.object) ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe((result: any) => {

        result.should.be.eql([ 'handler-resolved' ]);

        handlerMock.verifyAll();
        nextMock.verifyAll();
      });
  }

  @test 'should resolve the handlers if not observables and return the handle value - Function'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x([ 'handler1-resolved', 'handler2-resolved' ]))
      .returns((value: string[]) => of(value))
      .verifiable(Times.once());

    const handlerMock1 = Mock.ofType(Function);
    handlerMock1
      .setup(x => x(message))
      .returns(() => 'handler1-resolved')
      .verifiable(Times.once());

    const handlerMock2 = Mock.ofType(Function);
    handlerMock2
      .setup(x => x(message))
      .returns(() => of('handler2-resolved'))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock1.object, handlerMock2.object ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe((result: any) => {

        result.should.be.eql([ 'handler1-resolved', 'handler2-resolved' ]);

        handlerMock1.verifyAll();
        handlerMock2.verifyAll();
        nextMock.verifyAll();
      });
  }

  @test 'should rejected and don\'t catch the error if an handler fails - Message Handler'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x(It.isAny()))
      .returns((value: string[]) => of(value))
      .verifiable(Times.never());

    const handlerMock = Mock.ofType<any>();
    handlerMock
      .setup(x => x.handle(message))
      .throws(new Error('handler-error'))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock.object.handle.bind(handlerMock.object) ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe(
      () => { throw new Error('it-should-be-never-called'); },
      (error: Error) => {

        error.message.should.be.eql('handler-error');

        handlerMock.verifyAll();
        nextMock.verifyAll();
      }
    );
  }

  @test 'should rejected and don\'t catch the error if an handler fails - Function'() {

    const message = 'message';

    const nextMock = Mock.ofType(Function);
    nextMock
      .setup(x => x(message))
      .returns(() => of('next-resolved'))
      .verifiable(Times.never());

    const handlerMock1 = Mock.ofType(Function);
    handlerMock1
      .setup(x => x(message))
      .throws(new Error('handler1-error'))
      .verifiable(Times.once());

    const handlerMock2 = Mock.ofType(Function);
    handlerMock2
      .setup(x => x(message))
      .returns(() => of('handler2-resolved'))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(message))
      .returns(() => [ handlerMock1.object, handlerMock2.object ])
      .verifiable(Times.once());

    return this.messageHandlerMiddleware.handle(message, <any>nextMock.object)
      .subscribe(
        () => { throw new Error('it-should-be-never-called'); },
        (error: Error) => {

          error.message.should.be.eql('handler1-error');

          handlerMock1.verifyAll();
          nextMock.verifyAll();
        }
      );
  }

}
