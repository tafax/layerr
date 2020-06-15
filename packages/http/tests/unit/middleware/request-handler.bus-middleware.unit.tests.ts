
import { MessageMapperInterface } from '@layerr/bus';
import { JsonType } from '@layerr/core';
import { suite, test, Mock, IMock, Times, It, should } from '@layerr/test';
import { of } from 'rxjs';
import { HttpLayerrError } from '../../../src/error/http-layerr.error';
import { HttpExecution } from '../../../src/http-execution';
import { RequestHandlerBusMiddleware } from '../../../src/middleware/request-handler.bus-middleware';
import { RequestInterface } from '../../../src/request/request.interface';
import { RemoteResponse } from '../../../src/response/remote-response';

@suite class RequestHandlerBusMiddlewareUnitTests {

  private middleware: RequestHandlerBusMiddleware;
  private messageMapperMock: IMock<MessageMapperInterface>;

  before() {
    this.messageMapperMock = Mock.ofType<MessageMapperInterface>();
    this.middleware = new RequestHandlerBusMiddleware(this.messageMapperMock.object);
  }

  @test 'should call the handler'() {

    const requestMock = Mock.ofType<RequestInterface>();
    const responseMock = Mock.ofType<RemoteResponse<JsonType>>();

    const execution = new HttpExecution<any>({
      request: requestMock.object,
      response: responseMock.object,
      baseHost: 'baseHost',
      retryDelay: 200,
      retryAttemptCount: null,
      timeout: 6000
    });

    const next = (message: HttpExecution<any>) => of(message);

    const handlerMock = Mock.ofType<Function>();
    handlerMock
      .setup(x => x(
        It.is((request: RequestInterface) => {
          should.equal(request, requestMock.object);
          return true;
        }),
        It.is((response: RemoteResponse<JsonType>) => {
          should.equal(response, responseMock.object);
          return true;
        })
      ))
      .returns(() => of({ body: 'body' }))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(It.is((request: RequestInterface) => {
        should.equal(request, requestMock.object);
        return true;
      })))
      .returns(() => [ handlerMock.object ])
      .verifiable(Times.once());

    return this.middleware.handle(execution, next)
      .subscribe(
        (message: HttpExecution<any>) => {

          message.should.not.be.eql(execution);
          message.should.not.be.equal(execution);

          handlerMock.verifyAll();
          this.messageMapperMock.verifyAll();

          requestMock.verifyAll();
          responseMock.verifyAll();
        }
      );
  }

  @test 'should call the next middleware if no handlers are defined'() {

    const requestMock = Mock.ofType<RequestInterface>();
    const responseMock = Mock.ofType<RemoteResponse<JsonType>>();

    const execution = new HttpExecution<any>({
      request: requestMock.object,
      response: responseMock.object,
      baseHost: 'baseHost',
      retryDelay: 200,
      retryAttemptCount: null,
      timeout: 6000
    });

    const next = (message: HttpExecution<any>) => of(message);

    const handlerMock = Mock.ofType<Function>();
    handlerMock
      .setup(x => x(
        It.is((request: RequestInterface) => {
          should.equal(request, requestMock.object);
          return true;
        }),
        It.is((response: RemoteResponse<JsonType>) => {
          should.equal(response, responseMock.object);
          return true;
        })
      ))
      .returns(() => of({ body: 'body' }))
      .verifiable(Times.never());

    this.messageMapperMock
      .setup(x => x.getHandlers(It.is((request: RequestInterface) => {
        should.equal(request, requestMock.object);
        return true;
      })))
      .returns(() => [])
      .verifiable(Times.once());

    return this.middleware.handle(execution, next)
      .subscribe(
        (message: HttpExecution<any>) => {
          message.should.be.eql(execution);

          handlerMock.verifyAll();
          this.messageMapperMock.verifyAll();

          requestMock.verifyAll();
          responseMock.verifyAll();
        }
      );
  }

  @test 'should return an error if the response is not defined'() {

    const requestMock = Mock.ofType<RequestInterface>();

    const execution = new HttpExecution<any>({
      request: requestMock.object,
      baseHost: 'baseHost',
      retryDelay: 200,
      retryAttemptCount: null,
      timeout: 6000
    });

    const next = (message: HttpExecution<any>) => of(message);

    const handlerMock = Mock.ofType<Function>();
    handlerMock
      .setup(x => x(It.isAny(), It.isAny()))
      .verifiable(Times.never());

    this.messageMapperMock
      .setup(x => x.getHandlers(It.isAny()))
      .verifiable(Times.once());

    (() => {
      this.middleware.handle(execution, next);
    }).should.throw(HttpLayerrError);
  }

}
