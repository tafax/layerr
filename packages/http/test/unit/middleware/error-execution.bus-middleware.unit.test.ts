import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { suite, test, params } from '@testdeck/jest';
import { throwError, TimeoutError } from 'rxjs';
import { mock, instance, when } from 'ts-mockito';
import { resolvableInstance } from '../../../../../tests/index';
import { LoggerInterface } from '../../../../core/src/lib/services/logger/logger.interface';
import { HttpLayerrError } from '../../../src/lib/error/http-layerr.error';
import { HttpLayerrErrorType } from '../../../src/lib/error/http-layerr.error-type';
import { HttpExecution } from '../../../src/lib/http-execution';
import { ErrorExecutionBusMiddleware } from '../../../src/lib/middleware/error-execution.bus-middleware';
import { RequestInterface } from '../../../src/lib/request/request.interface';
import { ErrorRemoteResponse } from '../../../src/lib/response/error-remote-response';
import { HttpHeaders } from '../../../src/lib/utilities/http-headers';

@suite
class ErrorExecutionBusMiddlewareUnitTest {

  private SUT: ErrorExecutionBusMiddleware;
  private logger: LoggerInterface;

  before() {
    this.logger = mock<LoggerInterface>();
    this.SUT = new ErrorExecutionBusMiddleware(
      instance(this.logger),
    );
  }

  private static CreateExecution(): HttpExecution<unknown> {
    const request = mock<RequestInterface>();
    const execution = mock<HttpExecution<unknown>>();
    when(execution.request).thenReturn(resolvableInstance(request));
    return execution;
  }

  private static Provider(): [ number, string, HttpLayerrErrorType, string ][] {
    return [
      [
        400,
        '400',
        HttpLayerrErrorType.MALFORMED,
        '400',
      ],
      [
        401,
        '401',
        HttpLayerrErrorType.UNAUTHENTICATED,
        '401',
      ],
      [
        403,
        '403',
        HttpLayerrErrorType.FORBIDDEN,
        '403',
      ],
      [
        404,
        '404',
        HttpLayerrErrorType.NOT_FOUND,
        '404',
      ],
      [
        500,
        null,
        HttpLayerrErrorType.UNEXPECTED,
        'Generic error',
      ],
      [
        0,
        '0',
        HttpLayerrErrorType.UNKNOWN,
        'No status code - Unknown error [ 0',
      ],
    ];
  }

  @test
  givenExecutionAndNextGoesTimeout_whenHandle_thenCallOnErrorCallback() {
    const execution = ErrorExecutionBusMiddlewareUnitTest.CreateExecution();

    const timeoutError = new TimeoutError();
    timeoutError.message = 'timeout';

    const next = jest.fn((message: HttpExecution<unknown>) => throwError(timeoutError));

    const observable = subscribeSpyTo(this.SUT.handle(instance(execution), next), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedError()).toBeTruthy();
    expect(observable.getError()).toBeInstanceOf(HttpLayerrError);

    const error = observable.getError() as HttpLayerrError;
    expect(error.message).toBe(timeoutError.message);
    expect(error.type).toBe(HttpLayerrErrorType.TIMEOUT);
    expect(error.status).toBe(-1);
    expect(error.statusText).toBe('Timeout');
    expect(error.request).toBe(instance(execution).request);
  }

  @test
  @params(ErrorExecutionBusMiddlewareUnitTest.Provider()[0])
  @params(ErrorExecutionBusMiddlewareUnitTest.Provider()[1])
  @params(ErrorExecutionBusMiddlewareUnitTest.Provider()[2])
  @params(ErrorExecutionBusMiddlewareUnitTest.Provider()[3])
  @params(ErrorExecutionBusMiddlewareUnitTest.Provider()[4])
  @params(ErrorExecutionBusMiddlewareUnitTest.Provider()[5])
  givenExecutionAndNextWithError_whenHandle_thenCallOnErrorCallback([ status, statusText, type, message ]: [ number, string, HttpLayerrErrorType, string ]) {
    const execution = ErrorExecutionBusMiddlewareUnitTest.CreateExecution();

    const baseError = new Error();

    const errorRemoteResponse = new ErrorRemoteResponse(
      'message',
      baseError,
      {},
      new HttpHeaders(),
      status,
      statusText,
      'url',
    );

    const next = jest.fn((message: HttpExecution<unknown>) => throwError(errorRemoteResponse));

    const observable = subscribeSpyTo(this.SUT.handle(instance(execution), next), { expectErrors: true });
    expect(observable.receivedNext()).toBeFalsy();
    expect(observable.receivedError()).toBeTruthy();
    expect(observable.getError()).toBeInstanceOf(HttpLayerrError);

    const error = observable.getError() as HttpLayerrError;
    expect(error.message).toBe(`${message} - ${errorRemoteResponse.message}${status === 0 ? ' ]' : ''}`);
    expect(error.type).toBe(type);
    expect(error.status).toBe(errorRemoteResponse.status);
    expect(error.statusText).toBe(errorRemoteResponse.statusText);
    expect(error.request).toBe(instance(execution).request);
    expect(error.original).toBe(errorRemoteResponse);
    expect(error.errorContent).toBe(status === 0 ? null : errorRemoteResponse.body);
  }
}
