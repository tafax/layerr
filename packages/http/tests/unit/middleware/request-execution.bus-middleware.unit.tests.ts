
import { suite, test, Mock, IMock, Times } from '@layerr/test';
import { of, throwError } from 'rxjs';
import { HttpAdapterInterface } from '../../../src/adapter/http-adapter.interface';
import { HttpExecution } from '../../../src/http-execution';
import { RequestExecutionBusMiddleware } from '../../../src/middleware/request-execution.bus-middleware';
import { RequestInterface } from '../../../src/request/request.interface';
import { ErrorRemoteResponse } from '../../../src/response/error-remote-response';
import { RemoteResponse } from '../../../src/response/remote-response';
import { HttpHeaders } from '../../../src/utilities/http-headers';

@suite class RequestExecutionBusMiddlewareUnitTests {

  private middleware: RequestExecutionBusMiddleware;
  private adapterMock: IMock<HttpAdapterInterface>;

  before() {
    this.adapterMock = Mock.ofType<HttpAdapterInterface>();
    this.middleware = new RequestExecutionBusMiddleware(this.adapterMock.object);
  }

  @test 'should call the adapter with the execution - no timeout, not retry'() {

    const remoteCallMock = {} as unknown as RequestInterface;

    const execution = new HttpExecution();
    execution.baseHost = 'baseHost';
    execution.request = remoteCallMock;
    execution.retryAttemptCount = 0;

    const response = new RemoteResponse(
      null,
      new HttpHeaders(),
      0,
      'statusText',
      'url'
    );

    this.adapterMock
      .setup(x => x.execute('baseHost', remoteCallMock))
      .returns(() => of(response))
      .verifiable(Times.once());

    const nextMock = (execution) => of(execution);

    return this.middleware.handle(
      execution,
      nextMock
    )
      .subscribe(
        (message: HttpExecution) => {
          message.response.should.be.eql(response);

          this.adapterMock.verifyAll();
        }
      );
  }

  @test 'should throw an error response - no timeout, not retry'() {

    const remoteCallMock = {} as unknown as RequestInterface;

    const execution = new HttpExecution();
    execution.baseHost = 'baseHost';
    execution.request = remoteCallMock;
    execution.retryAttemptCount = 0;

    const errorRemoteResponse = new ErrorRemoteResponse(
      'message',
      null,
      null,
      new HttpHeaders(),
      0,
      'statusText',
      'url'
    );

    this.adapterMock
      .setup(x => x.execute('baseHost', remoteCallMock))
      .returns(() => throwError(errorRemoteResponse))
      .verifiable(Times.once());

    const nextMock = (execution) => of(execution);

    return this.middleware.handle(
      execution,
      nextMock
      )
      .subscribe(
        () => { throw new Error('it-should-never-be-called'); },
        (error: ErrorRemoteResponse<any>) => {
          error.should.be.eql(errorRemoteResponse);
          this.adapterMock.verifyAll();
        }
      );
  }

}
