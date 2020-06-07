
import { suite, test, IMock, Mock, Times, It } from '@layerr/test';
import {
  CollectionHandlerLookup,
  FunctionConstructorMessageTypeExtractor,
  MessageMapper,
  MessageBus
} from '@layerr/bus';
import { ClassResolverInterface, JsonType, LoggerInterface } from '@layerr/core';
import { of, throwError } from 'rxjs';
import { HttpHeaders } from '../..';
import { HttpAdapterInterface } from '../../src/adapter/http-adapter.interface';
import { HttpLayerrError } from '../../src/error/http-layerr.error';
import { HttpLayerrErrorType } from '../../src/error/http-layerr.error-type';
import { ErrorExecutionBusMiddleware } from '../../src/middleware/error-execution.bus-middleware';
import { RequestExecutionBusMiddleware } from '../../src/middleware/request-execution.bus-middleware';
import { RequestHandlerBusMiddleware } from '../../src/middleware/request-handler.bus-middleware';
import { ErrorRemoteResponse } from '../../src/response/error-remote-response';
import { RemoteResponse } from '../../src/response/remote-response';
import { RequestExecutor } from '../../src/service/request-executor';
import { TestRestfulRequestHandler } from '../fixtures/test-restful.request-handler';
import { TestRestfulRequest } from '../fixtures/test.restful-request';

@suite class RequestExecutorIntegrationTests {

  private requestExecutor: RequestExecutor;
  private classResolverMock: IMock<ClassResolverInterface>;
  private httpAdapterMock: IMock<HttpAdapterInterface>;
  private loggerMock: IMock<LoggerInterface>;

  before() {

    this.classResolverMock = Mock.ofType<ClassResolverInterface>();
    this.httpAdapterMock = Mock.ofType<HttpAdapterInterface>();
    this.loggerMock = Mock.ofType<LoggerInterface>();

    const collection = new CollectionHandlerLookup([
      { message: TestRestfulRequest, handler: TestRestfulRequestHandler }
    ]);
    const extractor = new FunctionConstructorMessageTypeExtractor();

    const classMapHandler = new MessageMapper(collection, extractor, this.classResolverMock.object);

    const errorExecutionBusMiddleware = new ErrorExecutionBusMiddleware(this.loggerMock.object);
    const requestHandlerBusMiddleware = new RequestHandlerBusMiddleware(classMapHandler);
    const requestExecutionBusMiddleware = new RequestExecutionBusMiddleware(this.httpAdapterMock.object);

    const messageBus = new MessageBus([
      errorExecutionBusMiddleware,
      requestHandlerBusMiddleware,
      requestExecutionBusMiddleware
    ]);

    this.requestExecutor = new RequestExecutor(
      'baseHost',
      null,
      0,
      60,
      messageBus
    );
  }

  @test 'should return the remote response'() {

    const request = new TestRestfulRequest('path', 'v1');
    const remoteResponse = new RemoteResponse(
      {},
        new HttpHeaders(),
        200,
        '200',
        'url'
      );

    this.classResolverMock
      .setup(x => x.resolve(TestRestfulRequestHandler))
      .returns(() => new TestRestfulRequestHandler())
      .verifiable(Times.once());

    this.httpAdapterMock
      .setup(x => x.execute('baseHost', request))
      .returns(() => of(remoteResponse))
      .verifiable(Times.once());

    return this.requestExecutor.execute(request)
      .subscribe(
        (response: RemoteResponse<JsonType>) => {

          response.should.be.eql(remoteResponse);

          this.classResolverMock.verifyAll();
        }
      );
  }

  @test 'should return the error remote response'() {

    const request = new TestRestfulRequest('path', 'v1');
    const errorRemoteResponse = new ErrorRemoteResponse(
      'error',
      new Error(),
      {},
      new HttpHeaders(),
      400,
      '400',
      'url'
    );

    this.classResolverMock
      .setup(x => x.resolve(TestRestfulRequestHandler))
      .returns(() => new TestRestfulRequestHandler())
      .verifiable(Times.once());

    this.httpAdapterMock
      .setup(x => x.execute('baseHost', request))
      .returns(() => throwError(errorRemoteResponse))
      .verifiable(Times.once());

    return this.requestExecutor.execute(request)
      .subscribe(
        () => { throw new Error('it-should-be-never-called'); },
        (error: HttpLayerrError) => {

          error.should.be.instanceof(HttpLayerrError);
          error.request.should.be.eql(request);
          error.errorContent.should.be.eql(errorRemoteResponse.body);
          error.status.should.be.eql(errorRemoteResponse.status);
          error.statusText.should.be.eql(errorRemoteResponse.statusText);
          error.message.should.be.eql(`${errorRemoteResponse.statusText} - ${errorRemoteResponse.message}`);
          error.original.should.be.eql(errorRemoteResponse);
          error.type.should.be.eql(HttpLayerrErrorType.MALFORMED);

          this.classResolverMock.verifyAll();
        }
      );
  }

}
