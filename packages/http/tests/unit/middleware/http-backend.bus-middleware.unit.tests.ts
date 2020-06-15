
import { MessageTypeExtractorInterface } from '@layerr/bus';
import { suite, test, IMock, Mock, Times, should } from '@layerr/test';
import { of } from 'rxjs';
import { HttpLayerrError } from '../../../src/error/http-layerr.error';
import { HttpLayerrErrorType } from '../../../src/error/http-layerr.error-type';
import { HttpExecution } from '../../../src/http-execution';
import { HttpBackendDecoratorResolver } from '../../../src/middleware/http-backend/decorator/http-backend.decorator-resolver';
import { HttpBackendBusMiddleware } from '../../../src/middleware/http-backend/http-backend.bus-middleware';
import { RequestInterface } from '../../../src/request/request.interface';
import { TestRequest } from '../../fixtures/test.request';

@suite class HttpBackendBusMiddlewareUnitTests {

  private middleware: HttpBackendBusMiddleware<string>;
  private extractorMock: IMock<MessageTypeExtractorInterface>;
  private resolverMock: IMock<HttpBackendDecoratorResolver<string>>;

  before() {
    this.extractorMock = Mock.ofType<MessageTypeExtractorInterface>();
    this.resolverMock = Mock.ofType<HttpBackendDecoratorResolver<string>>();

    this.middleware = new HttpBackendBusMiddleware(
      [
        [ 'ADMIN', 'api.admin' ],
        [ 'PUBLIC', 'api.public' ],
        [ 'NULL', null ],
      ],
      this.extractorMock.object,
      this.resolverMock.object
    );
  }

  @test 'should resolve the correct base host'(done) {

    const execution = new HttpExecution<any>({
      request: {} as unknown as RequestInterface,
      baseHost: 'baseHost',
      retryDelay: 200,
      retryAttemptCount: null,
      timeout: 6000
    });

    this.extractorMock
      .setup(x => x.extract(execution.request))
      .returns(() => TestRequest)
      .verifiable(Times.once());

    this.resolverMock
      .setup(x => x.getValue(TestRequest))
      .returns(() => 'ADMIN')
      .verifiable(Times.once());

    const next = (message: HttpExecution<any>) => of(message);

    return this.middleware.handle(execution, next)
      .subscribe(
        (message: HttpExecution<any>) => {

          message.baseHost.should.be.eql('api.admin');

          this.extractorMock.verifyAll();
          this.resolverMock.verifyAll();

          done();
        }
      );
  }

  @test 'should throw an exception if the backend key is not defined'(done) {

    const execution = new HttpExecution<any>({
      request: {} as unknown as RequestInterface,
      baseHost: 'baseHost',
      retryDelay: 200,
      retryAttemptCount: null,
      timeout: 6000
    });

    this.extractorMock
      .setup(x => x.extract(execution.request))
      .returns(() => TestRequest)
      .verifiable(Times.once());

    this.resolverMock
      .setup(x => x.getValue(TestRequest))
      .returns(() => 'NOT_DEFINED')
      .verifiable(Times.once());

    const next = (message: HttpExecution<any>) => of(message);

    return this.middleware.handle(execution, next)
      .subscribe(
        () => { throw new Error('it-should-not-be-called'); },
        (error: HttpLayerrError) => {

          error.should.be.instanceof(HttpLayerrError);
          error.message.should.be.eql('Backend key "NOT_DEFINED" doesn\'t exists.');
          error.type.should.be.eql(HttpLayerrErrorType.INTERNAL);
          error.request.should.be.eql(execution.request);
          should.not.exist(error.status);
          should.not.exist(error.statusText);
          should.not.exist(error.original);
          should.not.exist(error.errorContent);

          this.extractorMock.verifyAll();
          this.resolverMock.verifyAll();

          done();
        }
      );
  }

  @test 'should throw an exception if the base host is not defined'(done) {

    const execution = new HttpExecution<any>({
      request: {} as unknown as RequestInterface,
      baseHost: 'baseHost',
      retryDelay: 200,
      retryAttemptCount: null,
      timeout: 6000
    });

    this.extractorMock
      .setup(x => x.extract(execution.request))
      .returns(() => TestRequest)
      .verifiable(Times.once());

    this.resolverMock
      .setup(x => x.getValue(TestRequest))
      .returns(() => 'NULL')
      .verifiable(Times.once());

    const next = (message: HttpExecution<any>) => of(message);

    return this.middleware.handle(execution, next)
      .subscribe(
        () => { throw new Error('it-should-not-be-called'); },
        (error: HttpLayerrError) => {

          error.should.be.instanceof(HttpLayerrError);
          error.message.should.be.eql('Backend key "NULL" points to a not valid base host.');
          error.type.should.be.eql(HttpLayerrErrorType.INTERNAL);
          error.request.should.be.eql(execution.request);
          should.not.exist(error.status);
          should.not.exist(error.statusText);
          should.not.exist(error.original);
          should.not.exist(error.errorContent);

          this.extractorMock.verifyAll();
          this.resolverMock.verifyAll();

          done();
        }
      );
  }

}
