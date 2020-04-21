
import { JsonType } from '@layerr/core';
import { suite, test, Mock, should } from '@layerr/test';
import { ErrorRemoteResponse } from '../../../src/response/error-remote-response';
import { HttpHeaders } from '../../../src/utilities/http-headers';

@suite class ErrorRemoteResponseUnitTests {

  private response: ErrorRemoteResponse<JsonType>;
  private responseNoError: ErrorRemoteResponse<JsonType>;

  before() {

    const errorMock = Mock.ofType(Error);
    const httpHeadersMock = Mock.ofType(HttpHeaders);

    this.response = new ErrorRemoteResponse(
      'message',
      errorMock.object,
      { body: 'body' },
      httpHeadersMock.object,
      0,
      'statusText',
      'url'
    );

    this.responseNoError = new ErrorRemoteResponse(
      'message',
      null,
      null,
      httpHeadersMock.object,
      0,
      'statusText',
      'url'
    );
  }

  @test 'should return its properties'() {
    this.response.name.should.be.eql('ErrorRemoteResponse');
    this.response.message.should.be.eql('message');
    should.exist(this.response.error);
    should.exist(this.response.headers);
    this.response.body.should.be.eql({ body: 'body' });
    this.response.status.should.be.eql(0);
    this.response.statusText.should.be.eql('statusText');
    this.response.url.should.be.eql('url');
  }

  @test 'should return its properties with no error'() {
    this.responseNoError.name.should.be.eql('ErrorRemoteResponse');
    this.responseNoError.message.should.be.eql('message');
    should.not.exist(this.responseNoError.error);
    should.exist(this.responseNoError.headers);
    should.not.exist(this.responseNoError.body);
    this.responseNoError.status.should.be.eql(0);
    this.responseNoError.statusText.should.be.eql('statusText');
    this.responseNoError.url.should.be.eql('url');
  }

}
