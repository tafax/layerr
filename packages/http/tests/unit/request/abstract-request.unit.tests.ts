
import { suite, should } from '@layerr/test';
import { AbstractRequest } from '../../../src/request/abstract.request';
import { TestRequest } from '../../fixtures/test.request';

interface RequestBody {
  username: string;
  password: string;
}

@suite class AbstractRestfulRequestUnitTests {

  private requestWithVersion: AbstractRequest<RequestBody>;
  private requestNoVersion: AbstractRequest<RequestBody>;
  private requestWithBody: AbstractRequest<RequestBody>;

  before() {
    this.requestWithVersion = new TestRequest({
      path: '/path',
      version: 'v1'
    });
    this.requestNoVersion = new TestRequest({
      path: '/path',
      version: null
    });
    this.requestWithBody = new TestRequest({
      path: '/path',
      version: 'v1',
      body: {
        username: 'user',
        password: 'pass'
      }
    });
  }

  @test 'should return the path'() {
    this.requestWithVersion.path.should.be.eql('/v1/path');
    this.requestNoVersion.path.should.be.eql('/path');
  }

  @test 'should return the version'() {
    this.requestWithVersion.version.should.be.eql('v1');
  }

  @test 'should return a null body'() {
    should.not.exist(this.requestWithVersion.getBody());
  }

  @test 'should return an empty headers map'() {
    this.requestWithVersion.getHeaders().should.not.be.null;
  }

  @test 'should return an empty query map'() {
    this.requestWithVersion.getQuery().should.not.be.null;
  }

  @test 'should serialize the body'() {
    this.requestWithBody.getBody().should.be.eql({ username: 'user', password: 'pass' });
  }

  @test 'should clone the request'() {
    const clonedRequest = this.requestWithBody.clone();
    clonedRequest.path.should.be.eql(this.requestWithVersion.path);
    clonedRequest.version.should.be.eql(this.requestWithVersion.version);

    let headers = this.requestWithBody.getHeaders();
    headers = headers.append('name', 'value');
    const headersRequest = this.requestWithBody.clone({ headers });
    headersRequest.path.should.be.eql('/v1/path');
    headersRequest.version.should.be.eql('v1');
    headersRequest.getHeaders().should.be.eql(headers);

    const headersRequest1 = this.requestWithBody.clone({});
    headersRequest1.path.should.be.eql('/v1/path');
    headersRequest1.version.should.be.eql('v1');

    const bodyRequest1 = this.requestWithBody.clone({ body: { username: 'user1', password: 'pass1' } });
    bodyRequest1.path.should.be.eql('/v1/path');
    bodyRequest1.version.should.be.eql('v1');
    bodyRequest1.getBody().should.be.eql({ username: 'user1', password: 'pass1' });
  }

}
