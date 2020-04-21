
import { JsonType } from '@layerr/core';
import { suite, test, Mock, should } from '@layerr/test';
import { RemoteResponse } from '../../../src/response/remote-response';
import { HttpHeaders } from '../../../src/utilities/http-headers';

@suite class RemoteResponseUnitTests {

  private response: RemoteResponse<JsonType>;
  private responseNoBody: RemoteResponse<JsonType>;

  before() {

    const httpHeaders = Mock.ofType(HttpHeaders);

    this.response = new RemoteResponse(
      { body: 'body' },
      httpHeaders.object,
      0,
      'statusText',
      'url'
    );

    this.responseNoBody = new RemoteResponse(
      null,
      httpHeaders.object,
      0,
      'statusText',
      'url'
    );
  }

  @test 'should return its properties'() {
    should.exist(this.response.headers);
    this.response.body.should.be.eql({ body: 'body' });
    this.response.status.should.be.eql(0);
    this.response.statusText.should.be.eql('statusText');
    this.response.url.should.be.eql('url');
  }

  @test 'should return its properties with no body'() {
    should.exist(this.responseNoBody.headers);
    should.not.exist(this.responseNoBody.body);
    this.responseNoBody.status.should.be.eql(0);
    this.responseNoBody.statusText.should.be.eql('statusText');
    this.responseNoBody.url.should.be.eql('url');
  }

  @test 'should return true if it has a body, false otherwise'() {
    this.response.hasBody().should.be.true;
    this.responseNoBody.hasBody().should.be.false;
  }

}
