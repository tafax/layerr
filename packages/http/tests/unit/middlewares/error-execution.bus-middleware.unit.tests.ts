
import { LoggerInterface } from '@swiss/core';
import { suite, test, IMock, Mock, Times, should } from '@swiss/test';
import { HttpBusError, HttpBusErrorType, RemoteCallInterface } from '../../..';
import { ErrorExecutionBusMiddleware } from '../../../src/middlewares/error-execution.bus-middleware';
import { TimeoutError, throwError } from 'rxjs';
import { HttpExecution } from '../../../src/service/http-execution';

//@ts-ignore
@suite class ErrorExecutionBusMiddlewareUnitTests {

  private errorExecutionBusMiddleware: ErrorExecutionBusMiddleware;

  private loggerMock: IMock<LoggerInterface>;

  before() {

    this.loggerMock = Mock.ofType<LoggerInterface>();

    this.errorExecutionBusMiddleware = new ErrorExecutionBusMiddleware(
      this.loggerMock.object
    );
  }

  @test 'should handle the timeout errors'() {

    const timeoutError = new TimeoutError();
    timeoutError.message = 'message';

    const remoteCallMock = Mock.ofType<RemoteCallInterface>();

    const execution = new HttpExecution();
    execution.remoteCall = remoteCallMock.object;

    const next = () => throwError(timeoutError);

    this.errorExecutionBusMiddleware.handle(execution, next)
      .subscribe(
        () => { throw new Error('it-should-be-never-called'); },
        (error: Error) => {

          error.should.be.instanceof(HttpBusError);

          const specError = <HttpBusError>error;
          specError.type.should.be.eql(HttpBusErrorType.TIMEOUT);
          specError.message.should.be.eql(timeoutError.message);
          specError.status.should.be.eql(-1);
          specError.statusText.should.be.eql('Timeout');
          should.equal(specError.remoteCall, execution.remoteCall);
          should.equal(specError.errorContent, undefined);

        }
      )

  }

}
