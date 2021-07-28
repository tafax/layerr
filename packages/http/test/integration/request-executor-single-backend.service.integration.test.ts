import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { suite, test } from '@testdeck/jest';
import { deepStrictEqual } from 'assert';
import { of, throwError } from 'rxjs';
import { mock, instance, when, deepEqual, anyOfClass } from 'ts-mockito';
import { MessageBus } from '../../../bus/src/lib/bus/message-bus';
import { FunctionConstructorMessageTypeExtractor } from '../../../bus/src/lib/message-handler/extractor/function-constructor.message-type-extractor';
import { CollectionHandlerLookup } from '../../../bus/src/lib/message-handler/handler-lookup/collection/collection.handler-lookup';
import { MessageMapper } from '../../../bus/src/lib/message-handler/message-mapper/message.mapper';
import { ClassResolverInterface } from '../../../core/src/lib/resolvers/class-resolver.interface';
import { LoggerInterface } from '../../../core/src/lib/services/logger/logger.interface';
import { HttpAdapterInterface } from '../../src/lib/adapter/http-adapter.interface';
import { HttpLayerrError } from '../../src/lib/error/http-layerr.error';
import { HttpLayerrErrorType } from '../../src/lib/error/http-layerr.error-type';
import { ErrorExecutionBusMiddleware } from '../../src/lib/middleware/error-execution.bus-middleware';
import { RequestExecutionBusMiddleware } from '../../src/lib/middleware/request-execution.bus-middleware';
import { RequestHandlerBusMiddleware } from '../../src/lib/middleware/request-handler.bus-middleware';
import { ErrorRemoteResponse } from '../../src/lib/response/error-remote-response';
import { RemoteResponse } from '../../src/lib/response/remote-response';
import { RequestExecutor } from '../../src/lib/service/request-executor';
import { HttpHeaders } from '../../src/lib/utilities/http-headers';
import { TestRequest } from '../fixtures/test.request';
import { TestRequestHandler } from '../fixtures/test.request-handler';

@suite
class RequestExecutorSingleBackendServiceIntegrationTest {

  private SUT: RequestExecutor;
  private classResolver: ClassResolverInterface;
  private httpAdapter: HttpAdapterInterface;
  private logger: LoggerInterface;

  before() {

    this.classResolver = mock<ClassResolverInterface>();
    this.httpAdapter = mock<HttpAdapterInterface>();
    this.logger = mock<LoggerInterface>();

    const collection = new CollectionHandlerLookup([
      { message: TestRequest, handler: TestRequestHandler },
    ]);
    const extractor = new FunctionConstructorMessageTypeExtractor();

    const classMapHandler = new MessageMapper(
      collection,
      extractor,
      instance(this.classResolver),
    );

    const errorExecutionBusMiddleware = new ErrorExecutionBusMiddleware(instance(this.logger));
    const requestExecutionBusMiddleware = new RequestExecutionBusMiddleware(instance(this.httpAdapter));
    const requestHandlerBusMiddleware = new RequestHandlerBusMiddleware(classMapHandler);

    const messageBus = new MessageBus([
      errorExecutionBusMiddleware,
      requestExecutionBusMiddleware,
      requestHandlerBusMiddleware,
    ]);

    this.SUT = new RequestExecutor(
      'baseHost',
      null,
      0,
      0,
      messageBus,
    );
  }

  @test
  givenRequest_whenExecute_thenReturnResponse() {
    const request = new TestRequest({ path: 'path', version: 'v1' });
    const remoteResponse = new RemoteResponse(
      {},
        new HttpHeaders(),
        200,
        '200',
        'url',
      );

    when(this.classResolver.resolve(TestRequestHandler)).thenReturn(new TestRequestHandler());
    when(this.httpAdapter.execute('baseHost', anyOfClass(TestRequest))).thenReturn(of(remoteResponse));

    const observable = subscribeSpyTo(this.SUT.execute(request));
    expect(observable.receivedComplete()).toBeTruthy();
    expect(observable.getLastValue()).toStrictEqual(remoteResponse);
  }

  @test givenRequest_whenExecute_thenReturnErrorRemoteResponse() {
    const request = new TestRequest({ path: 'path', version: 'v1' });
    const errorRemoteResponse = new ErrorRemoteResponse(
      'error',
      new Error(),
      {},
      new HttpHeaders(),
      400,
      '400',
      'url',
    );

    when(this.classResolver.resolve(TestRequestHandler)).thenReturn(new TestRequestHandler());
    when(this.httpAdapter.execute('baseHost', anyOfClass(TestRequest))).thenReturn(throwError(errorRemoteResponse));

    const observable = subscribeSpyTo(this.SUT.execute(request), { expectErrors: true });
    const error = observable.getError() as HttpLayerrError;
    expect(error).toBeInstanceOf(HttpLayerrError);
    expect(error.request).toStrictEqual(request.clone());
    expect(error.errorContent).toStrictEqual(errorRemoteResponse.body);
    expect(error.status).toStrictEqual(errorRemoteResponse.status);
    expect(error.statusText).toStrictEqual(errorRemoteResponse.statusText);
    expect(error.message).toStrictEqual(`${errorRemoteResponse.statusText} - ${errorRemoteResponse.message}`);
    expect(error.original).toStrictEqual(errorRemoteResponse);
    expect(error.type).toStrictEqual(HttpLayerrErrorType.MALFORMED);
  }
}
