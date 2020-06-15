
import { JsonType } from '@layerr/core';
import { suite, test, Mock, should } from '@layerr/test';
import { HttpExecution } from '../../src/http-execution';
import { RequestInterface } from '../../src/request/request.interface';
import { RemoteResponse } from '../../src/response/remote-response';

@suite class HttpExecutionUnitTests {

  @test 'should create the http execution with all data'() {

    const requestMock = Mock.ofType<RequestInterface>();
    const responseMock = Mock.ofType<RemoteResponse<JsonType>>();

    const execution = new HttpExecution({
      request: requestMock.object,
      response: responseMock.object,
      content: {},
      baseHost: 'baseHost',
      retryAttemptCount: 0,
      retryDelay: 0,
      timeout: 0
    });

    should.equal(execution.request, requestMock.object);
    should.equal(execution.response, responseMock.object);
    execution.baseHost.should.be.eql('baseHost');
    execution.retryAttemptCount.should.be.eql(0);
    execution.retryDelay.should.be.eql(0);
    execution.timeout.should.be.eql(0);

    execution.hasResponse().should.be.true;
    execution.hasContent().should.be.true;
  }

  @test 'should create the http execution with mandatory data'() {

    const requestMock = Mock.ofType<RequestInterface>();
    const responseMock = Mock.ofType<RemoteResponse<JsonType>>();

    const execution = new HttpExecution({
      request: requestMock.object,
      baseHost: 'baseHost',
      retryAttemptCount: 0,
      retryDelay: 0,
      timeout: 0
    });

    should.equal(execution.request, requestMock.object);
    should.not.equal(execution.response, responseMock.object);
    execution.baseHost.should.be.eql('baseHost');
    execution.retryAttemptCount.should.be.eql(0);
    execution.retryDelay.should.be.eql(0);
    execution.timeout.should.be.eql(0);

    execution.hasResponse().should.be.false;
    execution.hasContent().should.be.false;
  }

  @test 'should clone the http execution'() {

    const requestMock = Mock.ofType<RequestInterface>();
    const responseMock = Mock.ofType<RemoteResponse<JsonType>>();

    let execution = new HttpExecution({
      request: requestMock.object,
      baseHost: 'baseHost',
      retryAttemptCount: 0,
      retryDelay: 0,
      timeout: 0
    });

    should.equal(execution.request, requestMock.object);
    should.not.equal(execution.response, responseMock.object);
    execution.baseHost.should.be.eql('baseHost');
    execution.retryAttemptCount.should.be.eql(0);
    execution.retryDelay.should.be.eql(0);
    execution.timeout.should.be.eql(0);

    execution.hasResponse().should.be.false;
    execution.hasContent().should.be.false;

    execution = execution.clone();

    should.equal(execution.request, requestMock.object);
    should.not.equal(execution.response, responseMock.object);
    execution.baseHost.should.be.eql('baseHost');
    execution.retryAttemptCount.should.be.eql(0);
    execution.retryDelay.should.be.eql(0);
    execution.timeout.should.be.eql(0);

    execution.hasResponse().should.be.false;
    execution.hasContent().should.be.false;

    const newRequestMock = Mock.ofType<RequestInterface>();

    execution = execution.clone({
      response: responseMock.object,
      request: newRequestMock.object,
      content: {},
    });

    should.equal(execution.request, newRequestMock.object);
    should.equal(execution.response, responseMock.object);
    execution.baseHost.should.be.eql('baseHost');
    execution.retryAttemptCount.should.be.eql(0);
    execution.retryDelay.should.be.eql(0);
    execution.timeout.should.be.eql(0);

    execution.hasResponse().should.be.true;
    execution.hasContent().should.be.true;
  }

}
