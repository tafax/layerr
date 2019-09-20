
import { suite, test, IMock, Mock, It, Times, should } from '@swiss/test';
import { of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { MessageBus, MessageBusMiddlewareInterface } from '../../../src/public_api';

//@ts-ignore
@suite class MessageBusUnitTests {

  private messageBusFull: MessageBus<any>;
  private messageBusEmpty: MessageBus<any>;

  private middleware1Mock: IMock<MessageBusMiddlewareInterface>;
  private middleware2Mock: IMock<MessageBusMiddlewareInterface>;
  private middleware3Mock: IMock<MessageBusMiddlewareInterface>;

  before() {

    this.middleware1Mock = Mock.ofType<MessageBusMiddlewareInterface>();
    this.middleware2Mock = Mock.ofType<MessageBusMiddlewareInterface>();
    this.middleware3Mock = Mock.ofType<MessageBusMiddlewareInterface>();

    this.messageBusFull = new MessageBus([
      this.middleware1Mock.object,
      this.middleware2Mock.object,
      this.middleware3Mock.object
    ]);

    this.messageBusEmpty = new MessageBus();
  }

  @test 'should return an empty middleware'() {
    this.messageBusFull.middlewares.should.be.length(3);
    this.messageBusEmpty.middlewares.should.be.length(0);
  }

  @test 'should append a middleware'() {

    const middlewareMock = Mock.ofType<MessageBusMiddlewareInterface>();
    this.messageBusFull.appendMiddleware(middlewareMock.object);
    this.messageBusEmpty.appendMiddleware(middlewareMock.object);

    this.messageBusFull.middlewares.should.have.length(4);
    this.messageBusEmpty.middlewares.should.have.length(1);

    const anotherMiddlewareMock = Mock.ofType<MessageBusMiddlewareInterface>();
    this.messageBusFull.appendMiddleware(anotherMiddlewareMock.object);
    this.messageBusEmpty.appendMiddleware(anotherMiddlewareMock.object);

    const middlewaresFull = this.messageBusFull.middlewares;
    middlewaresFull.should.have.length(5);

    should.equal(middlewaresFull[0], this.middleware1Mock.object);
    should.equal(middlewaresFull[1], this.middleware2Mock.object);
    should.equal(middlewaresFull[2], this.middleware3Mock.object);
    should.equal(middlewaresFull[3], middlewareMock.object);
    should.equal(middlewaresFull[4], anotherMiddlewareMock.object);

    const middlewaresEmpty = this.messageBusEmpty.middlewares;
    middlewaresEmpty.should.have.length(2);

    should.equal(middlewaresEmpty[0], middlewareMock.object);
    should.equal(middlewaresEmpty[1], anotherMiddlewareMock.object);
  }

  @test 'should prepend a middleware'() {

    const middlewareMock = Mock.ofType<MessageBusMiddlewareInterface>();
    this.messageBusFull.prependMiddleware(middlewareMock.object);
    this.messageBusEmpty.prependMiddleware(middlewareMock.object);

    this.messageBusFull.middlewares.should.have.length(4);
    this.messageBusEmpty.middlewares.should.have.length(1);

    const anotherMiddlewareMock = Mock.ofType<MessageBusMiddlewareInterface>();
    this.messageBusFull.prependMiddleware(anotherMiddlewareMock.object);
    this.messageBusEmpty.prependMiddleware(anotherMiddlewareMock.object);

    const middlewaresFull = this.messageBusFull.middlewares;
    middlewaresFull.should.have.length(5);

    should.equal(middlewaresFull[0], anotherMiddlewareMock.object);
    should.equal(middlewaresFull[1], middlewareMock.object);
    should.equal(middlewaresFull[2], this.middleware1Mock.object);
    should.equal(middlewaresFull[3], this.middleware2Mock.object);
    should.equal(middlewaresFull[4], this.middleware3Mock.object);

    const middlewaresEmpty = this.messageBusEmpty.middlewares;
    middlewaresEmpty.should.have.length(2);

    should.equal(middlewaresEmpty[0], anotherMiddlewareMock.object);
    should.equal(middlewaresEmpty[1], middlewareMock.object);
  }

  @test 'should handle the message calling all middlewares'() {

    this.middleware1Mock
      .setup(x => x.handle('message', It.isAny()))
      .returns(
        (message: string, next: Function) => of(undefined)
          .pipe(concatMap(() => next(message)))
      )
      .verifiable(Times.once());

    this.middleware2Mock
      .setup(x => x.handle('message', It.isAny()))
      .returns(
        (message: string, next: Function) => of(undefined)
          .pipe(concatMap(() => next(message)))
      )
      .verifiable(Times.once());

    this.middleware3Mock
      .setup(x => x.handle('message', It.isAny()))
      .returns(
        (message: string, next: Function) => of(undefined)
          .pipe(
            concatMap(() => next(message)),
            map(() => 'result')
          )
      )
      .verifiable(Times.once());

    return this.messageBusFull.handle('message')
      .subscribe((result: string) => {
        result.should.be.eql('result');

        this.middleware1Mock.verifyAll();
        this.middleware2Mock.verifyAll();
        this.middleware3Mock.verifyAll();
      });
  }

  @test 'should handle the message calling all middlewares without subscribing'() {

    this.middleware1Mock
      .setup(x => x.handle('message', It.isAny()))
      .returns(
        (message: string, next: Function) => of(undefined)
          .pipe(concatMap(() => next(message)))
      )
      .verifiable(Times.once());

    this.middleware2Mock
      .setup(x => x.handle('message', It.isAny()))
      .returns(
        (message: string, next: Function) => of(undefined)
          .pipe(concatMap(() => next(message)))
      )
      .verifiable(Times.once());

    this.middleware3Mock
      .setup(x => x.handle('message', It.isAny()))
      .returns(
        (message: string, next: Function) => of(undefined)
          .pipe(
            concatMap(() => next(message)),
            map(() => 'result')
          )
      )
      .verifiable(Times.once());

    const execution$ = this.messageBusFull.handle('message');

    this.middleware1Mock.verifyAll();
    this.middleware2Mock.verifyAll();
    this.middleware3Mock.verifyAll();

    return execution$.subscribe(
      (result: string) => {
        result.should.be.eql('result');

        this.middleware1Mock.verifyAll();
        this.middleware2Mock.verifyAll();
        this.middleware3Mock.verifyAll();
      }
    );
  }

  @test 'should handle the message calling all middlewares every time a message is executed'() {

    this.middleware1Mock
      .setup(x => x.handle('message', It.isAny()))
      .returns(
        (message: string, next: Function) => of(undefined)
          .pipe(concatMap(() => next(message)))
      )
      .verifiable(Times.exactly(2));

    this.middleware2Mock
      .setup(x => x.handle('message', It.isAny()))
      .returns(
        (message: string, next: Function) => of(undefined)
          .pipe(concatMap(() => next(message)))
      )
      .verifiable(Times.exactly(2));

    this.middleware3Mock
      .setup(x => x.handle('message', It.isAny()))
      .returns(
        (message: string, next: Function) => of(undefined)
          .pipe(
            concatMap(() => next(message)),
            map(() => 'result')
          )
      )
      .verifiable(Times.exactly(2));

    this.messageBusFull.handle('message');
    this.messageBusFull.handle('message');

    this.middleware1Mock.verifyAll();
    this.middleware2Mock.verifyAll();
    this.middleware3Mock.verifyAll();
  }

}
