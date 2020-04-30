
import { LoggerInterface } from '@layerr/core';
import { suite, test, IMock, Mock, Times, should } from '@layerr/test';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { RequestInterface, HttpHeaders } from '../../..';
import { HttpBusError } from '../../../src/error/http-bus.error';
import { HttpBusErrorType } from '../../../src/error/http-bus.error-type';
import { HttpExecution } from '../../../src/http-execution';
import { ErrorExecutionBusMiddleware } from '../../../src/middleware/error-execution.bus-middleware';
import { ErrorRemoteResponse } from '../../../src/response/error-remote-response';

@suite class ErrorExecutionBusMiddlewareUnitTests {

  private middleware: ErrorExecutionBusMiddleware;
  private loggerMock: IMock<LoggerInterface>;

  before() {
    this.loggerMock = Mock.ofType<LoggerInterface>();
    this.middleware = new ErrorExecutionBusMiddleware(this.loggerMock.object);
  }

  @test 'should create an error for the timeout'() {

    const execution = new HttpExecution();
    execution.request = {} as unknown as RequestInterface;

    const timeoutError = new TimeoutError();
    timeoutError.message = 'timeout';

    const nextMock = Mock.ofType<(message: HttpExecution) => Observable<any>>();
    nextMock
      .setup(x => x(execution))
      .returns(() => throwError(timeoutError))
      .verifiable(Times.once());

    return this.middleware.handle(
      execution,
      nextMock.object
    )
      .subscribe(
        () => { throw new Error('it-should-never-called'); },
        (error: HttpBusError) => {
          error.should.be.instanceof(HttpBusError);

          error.message.should.be.eql(timeoutError.message);
          error.type.should.be.eql(HttpBusErrorType.TIMEOUT);
          error.status.should.be.eql(-1);
          error.statusText.should.be.eql('Timeout');
          error.request.should.be.eql(execution.request);

          nextMock.verifyAll();
        }
      );
  }

  @test 'should create an error for the error status 400'() {

    const execution = new HttpExecution();
    execution.request = {} as unknown as RequestInterface;

    const baseError = new Error();

    const errorRemoteResponse = new ErrorRemoteResponse(
      'message',
      baseError,
      {},
      new HttpHeaders(),
      400,
      '400',
      'url'
    );

    const nextMock = Mock.ofType<(message: HttpExecution) => Observable<any>>();
    nextMock
      .setup(x => x(execution))
      .returns(() => throwError(errorRemoteResponse))
      .verifiable(Times.once());

    return this.middleware.handle(
      execution,
      nextMock.object
      )
      .subscribe(
        () => { throw new Error('it-should-never-called'); },
        (error: HttpBusError) => {
          error.should.be.instanceof(HttpBusError);

          error.message.should.be.eql(`400 - ${errorRemoteResponse.message}`);
          error.type.should.be.eql(HttpBusErrorType.MALFORMED);
          error.status.should.be.eql(errorRemoteResponse.status);
          error.statusText.should.be.eql(errorRemoteResponse.statusText);
          error.request.should.be.eql(execution.request);
          error.original.should.be.eql(errorRemoteResponse);
          error.errorContent.should.be.eql(errorRemoteResponse.body);

          nextMock.verifyAll();
        }
      );
  }

  @test 'should create an error for the error status 401'() {

    const execution = new HttpExecution();
    execution.request = {} as unknown as RequestInterface;

    const baseError = new Error();

    const errorRemoteResponse = new ErrorRemoteResponse(
      'message',
      baseError,
      {},
      new HttpHeaders(),
      401,
      '401',
      'url'
    );

    const nextMock = Mock.ofType<(message: HttpExecution) => Observable<any>>();
    nextMock
      .setup(x => x(execution))
      .returns(() => throwError(errorRemoteResponse))
      .verifiable(Times.once());

    return this.middleware.handle(
      execution,
      nextMock.object
      )
      .subscribe(
        () => { throw new Error('it-should-never-called'); },
        (error: HttpBusError) => {
          error.should.be.instanceof(HttpBusError);

          error.message.should.be.eql(`401 - ${errorRemoteResponse.message}`);
          error.type.should.be.eql(HttpBusErrorType.UNAUTHENTICATED);
          error.status.should.be.eql(errorRemoteResponse.status);
          error.statusText.should.be.eql(errorRemoteResponse.statusText);
          error.request.should.be.eql(execution.request);
          error.original.should.be.eql(errorRemoteResponse);
          error.errorContent.should.be.eql(errorRemoteResponse.body);

          nextMock.verifyAll();
        }
      );
  }

  @test 'should create an error for the error status 403'() {

    const execution = new HttpExecution();
    execution.request = {} as unknown as RequestInterface;

    const baseError = new Error();

    const errorRemoteResponse = new ErrorRemoteResponse(
      'message',
      baseError,
      {},
      new HttpHeaders(),
      403,
      '403',
      'url'
    );

    const nextMock = Mock.ofType<(message: HttpExecution) => Observable<any>>();
    nextMock
      .setup(x => x(execution))
      .returns(() => throwError(errorRemoteResponse))
      .verifiable(Times.once());

    return this.middleware.handle(
      execution,
      nextMock.object
      )
      .subscribe(
        () => { throw new Error('it-should-never-called'); },
        (error: HttpBusError) => {
          error.should.be.instanceof(HttpBusError);

          error.message.should.be.eql(`403 - ${errorRemoteResponse.message}`);
          error.type.should.be.eql(HttpBusErrorType.FORBIDDEN);
          error.status.should.be.eql(errorRemoteResponse.status);
          error.statusText.should.be.eql(errorRemoteResponse.statusText);
          error.request.should.be.eql(execution.request);
          error.original.should.be.eql(errorRemoteResponse);
          error.errorContent.should.be.eql(errorRemoteResponse.body);

          nextMock.verifyAll();
        }
      );
  }

  @test 'should create an error for the error status 404'() {

    const execution = new HttpExecution();
    execution.request = {} as unknown as RequestInterface;

    const baseError = new Error();

    const errorRemoteResponse = new ErrorRemoteResponse(
      'message',
      baseError,
      {},
      new HttpHeaders(),
      404,
      '404',
      'url'
    );

    const nextMock = Mock.ofType<(message: HttpExecution) => Observable<any>>();
    nextMock
      .setup(x => x(execution))
      .returns(() => throwError(errorRemoteResponse))
      .verifiable(Times.once());

    return this.middleware.handle(
      execution,
      nextMock.object
      )
      .subscribe(
        () => { throw new Error('it-should-never-called'); },
        (error: HttpBusError) => {
          error.should.be.instanceof(HttpBusError);

          error.message.should.be.eql(`404 - ${errorRemoteResponse.message}`);
          error.type.should.be.eql(HttpBusErrorType.NOT_FOUND);
          error.status.should.be.eql(errorRemoteResponse.status);
          error.statusText.should.be.eql(errorRemoteResponse.statusText);
          error.request.should.be.eql(execution.request);
          error.original.should.be.eql(errorRemoteResponse);
          error.errorContent.should.be.eql(errorRemoteResponse.body);

          nextMock.verifyAll();
        }
      );
  }

  @test 'should create an error for the error status 500'() {

    const execution = new HttpExecution();
    execution.request = {} as unknown as RequestInterface;

    const baseError = new Error();

    const errorRemoteResponse = new ErrorRemoteResponse(
      'message',
      baseError,
      {},
      new HttpHeaders(),
      500,
      null,
      'url'
    );

    const nextMock = Mock.ofType<(message: HttpExecution) => Observable<any>>();
    nextMock
      .setup(x => x(execution))
      .returns(() => throwError(errorRemoteResponse))
      .verifiable(Times.once());

    return this.middleware.handle(
      execution,
      nextMock.object
      )
      .subscribe(
        () => { throw new Error('it-should-never-called'); },
        (error: HttpBusError) => {
          error.should.be.instanceof(HttpBusError);

          error.message.should.be.eql(`Generic error - ${errorRemoteResponse.message}`);
          error.type.should.be.eql(HttpBusErrorType.UNEXPECTED);
          error.status.should.be.eql(errorRemoteResponse.status);
          should.not.exist(error.statusText);
          error.request.should.be.eql(execution.request);
          error.original.should.be.eql(errorRemoteResponse);
          error.errorContent.should.be.eql(errorRemoteResponse.body);

          nextMock.verifyAll();
        }
      );
  }

  @test 'should create an error for the error status 0'() {

    const execution = new HttpExecution();
    execution.request = {} as unknown as RequestInterface;

    const baseError = new Error();

    const errorRemoteResponse = new ErrorRemoteResponse(
      'message',
      baseError,
      {},
      new HttpHeaders(),
      0,
      '0',
      'url'
    );

    const nextMock = Mock.ofType<(message: HttpExecution) => Observable<any>>();
    nextMock
      .setup(x => x(execution))
      .returns(() => throwError(errorRemoteResponse))
      .verifiable(Times.once());

    return this.middleware.handle(
      execution,
      nextMock.object
      )
      .subscribe(
        () => { throw new Error('it-should-never-called'); },
        (error: HttpBusError) => {
          error.should.be.instanceof(HttpBusError);

          error.message.should.be.eql(`No status code - Unknown error [ 0 - ${errorRemoteResponse.message} ]`);
          error.type.should.be.eql(HttpBusErrorType.UNKNOWN);
          error.status.should.be.eql(errorRemoteResponse.status);
          error.statusText.should.be.eql(errorRemoteResponse.statusText);
          error.request.should.be.eql(execution.request);
          error.original.should.be.eql(errorRemoteResponse);
          should.not.exist(error.errorContent);

          nextMock.verifyAll();
        }
      );
  }

}
