
import { ClassResolverInterface, LoggerInterface, ClassType, JsonType } from '@swiss/core';
import { suite, test, IMock, Mock, Times } from '@swiss/test';
import { of } from 'rxjs';
import { RemoteCallOptions } from '../../../src/decorators/configurations/remote-call.options';
import { HttpBusError } from '../../../src/errors/http-bus.error';
import { RemoteCallHandlerBusMiddleware } from '../../../src/middlewares/remote-call-handler.bus-middleware';
import { RemoteCallHandlerInterface } from '../../../src/remote-call-handlers/remote-call-handler.interface';
import { RemoteCallInterface } from '../../../src/remote-call/remote-call.interface';
import { RemoteResponse } from '../../../src/response/remote-response';
import { HttpExecution } from '../../../src/service/http-execution';

//@ts-ignore
@suite class RemoteCallHandlerBusMiddlewareUnitTests {

  private remoteCallHandlerBusMiddleware: RemoteCallHandlerBusMiddleware;

  private classResolverMock: IMock<ClassResolverInterface>;
  private loggerMock: IMock<LoggerInterface>;

  before() {

    this.classResolverMock = Mock.ofType<ClassResolverInterface>();
    this.loggerMock = Mock.ofType<LoggerInterface>();

    this.remoteCallHandlerBusMiddleware = new RemoteCallHandlerBusMiddleware(
      this.classResolverMock.object,
      this.loggerMock.object
    );
  }

  @test 'should resolve the handler and handle the response'() {

    const remoteCallMock = Mock.ofType<RemoteCallInterface>();
    const handlerClassMock = Mock.ofType<ClassType<RemoteCallHandlerInterface>>();
    const handlerMock = Mock.ofType<RemoteCallHandlerInterface>();
    const response = new RemoteResponse((<JsonType>{}));

    const options = new RemoteCallOptions();
    options.handler = handlerClassMock.object;

    const execution = new HttpExecution();
    execution.remoteCall = remoteCallMock.object;
    execution.response = response;
    execution.options = options;

    handlerMock
      .setup(x => x.handle(remoteCallMock.object, response))
      .returns(() => of(response))

    this.classResolverMock
      .setup(x => x.resolve(handlerClassMock.object))
      .returns(() => handlerMock.object)
      .verifiable(Times.once());

    return this.remoteCallHandlerBusMiddleware.handle(execution, (message: any) => of(message))
      .subscribe((result: HttpExecution) => {

        result.should.be.equal(result);
        result.response.should.be.equal(response);

        this.classResolverMock.verifyAll();
        handlerMock.verifyAll();
      });

  }

  @test 'should return the executor if no handler is defined'() {

    const remoteCallMock = Mock.ofType<RemoteCallInterface>();
    const handlerClassMock = Mock.ofType<ClassType<RemoteCallHandlerInterface>>();
    const response = new RemoteResponse((<JsonType>{}));

    const options = new RemoteCallOptions();

    const execution = new HttpExecution();
    execution.remoteCall = remoteCallMock.object;
    execution.response = response;
    execution.options = options;

    this.classResolverMock
      .setup(x => x.resolve(handlerClassMock.object))
      .verifiable(Times.never());

    return this.remoteCallHandlerBusMiddleware.handle(execution, (message: any) => of(message))
      .subscribe((result: HttpExecution) => {

        result.should.be.equal(result);
        result.response.should.be.equal(response);

        this.classResolverMock.verifyAll();
      });

  }

  @test 'should throw an error if no handler is found'() {

    const remoteCallMock = Mock.ofType<RemoteCallInterface>();
    const handlerClassMock = Mock.ofType<ClassType<RemoteCallHandlerInterface>>();
    const response = new RemoteResponse((<JsonType>{}));

    const options = new RemoteCallOptions();
    options.handler = handlerClassMock.object;

    const execution = new HttpExecution();
    execution.remoteCall = remoteCallMock.object;
    execution.response = response;
    execution.options = options;

    this.classResolverMock
      .setup(x => x.resolve(handlerClassMock.object))
      .returns(() => undefined)
      .verifiable(Times.once());

    return this.remoteCallHandlerBusMiddleware.handle(execution, (message: any) => of(message))
      .subscribe(
          () => { throw new Error('it-should-never-be-called'); },
          (error: Error) => {

            error.should.be.instanceof(HttpBusError);

            this.classResolverMock.verifyAll();
          }
        );

  }

}
