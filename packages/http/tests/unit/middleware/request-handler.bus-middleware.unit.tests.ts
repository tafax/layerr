
import { MessageMapperInterface } from '@layerr/bus';
import { JsonType } from '@layerr/core';
import { suite, test, Mock, IMock, Times } from '@layerr/test';
import { of } from 'rxjs';
import { RequestInterface } from '../../..';
import { HttpExecution } from '../../../src/http-execution';
import { RequestHandlerBusMiddleware } from '../../../src/middleware/request-handler.bus-middleware';
import { RemoteResponse } from '../../../src/response/remote-response';

@suite class RequestHandlerBusMiddlewareUnitTests {

  private middeware: RequestHandlerBusMiddleware;
  private messageMapperMock: IMock<MessageMapperInterface>;

  before() {
    this.messageMapperMock = Mock.ofType<MessageMapperInterface>();
    this.middeware = new RequestHandlerBusMiddleware(this.messageMapperMock.object);
  }

  @test 'should call the handler'() {

    const request = {} as unknown as RequestInterface;
    const response = {} as unknown as RemoteResponse<JsonType>;

    const execution = new HttpExecution();
    execution.request = request;
    execution.response = response;

    const next = (message: HttpExecution) => of(message);

    const handlerMock = Mock.ofType<Function>();
    handlerMock
      .setup(x => x(request, response))
      .returns(() => of(response))
      .verifiable(Times.once());

    this.messageMapperMock
      .setup(x => x.getHandlers(request))
      .returns(() => [ handlerMock.object ])
      .verifiable(Times.once());

    return this.middeware.handle(execution, next)
      .subscribe(
        (message: HttpExecution) => {
          message.should.be.eql(execution);

          handlerMock.verifyAll();
          this.messageMapperMock.verifyAll();
        }
      );
  }

  @test 'should call the next middleware if no handlers are defined'() {

    const request = {} as unknown as RequestInterface;
    const response = {} as unknown as RemoteResponse<JsonType>;

    const execution = new HttpExecution();
    execution.request = request;
    execution.response = response;

    const next = (message: HttpExecution) => of(message);

    const handlerMock = Mock.ofType<Function>();
    handlerMock
      .setup(x => x(request, response))
      .returns(() => of(response))
      .verifiable(Times.never());

    this.messageMapperMock
      .setup(x => x.getHandlers(request))
      .returns(() => [])
      .verifiable(Times.once());

    return this.middeware.handle(execution, next)
      .subscribe(
        (message: HttpExecution) => {
          message.should.be.eql(execution);

          handlerMock.verifyAll();
          this.messageMapperMock.verifyAll();
        }
      );
  }

}
