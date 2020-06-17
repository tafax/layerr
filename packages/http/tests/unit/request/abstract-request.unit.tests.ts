import { suite, should } from '@layerr/test';
import { AbstractRequest } from '../../../src/request/abstract.request';
import { HttpHeaders } from '../../../src/utilities/http-headers';
import { HttpMethod } from '../../../src/utilities/http-method';
import { HttpParams } from '../../../src/utilities/http-params';
import { HttpResponseContent } from '../../../src/utilities/http-response-content';
import { TestRequest } from '../../fixtures/test.request';

@suite class AbstractRestfulRequestUnitTests {

  private requestWithVersion: AbstractRequest;
  private requestNoVersion: AbstractRequest;

  before() {
    this.requestWithVersion = new TestRequest({
      path: '/path',
      version: 'v1'
    });
    this.requestNoVersion = new TestRequest({
      path: '/path',
      version: null,
      headers: {
        header: 'header'
      },
      query: {
        query: 'query'
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
    this.requestNoVersion.getHeaders().should.be.eql(new HttpHeaders({ header: 'header' }));
  }

  @test 'should return an empty query map'() {
    this.requestWithVersion.getQuery().should.not.be.null;
    this.requestNoVersion.getQuery().should.be.eql(new HttpParams({ query: 'query' }));
  }

  @test 'should clone the request'() {
    const clonedRequest = this.requestWithVersion.clone();
    clonedRequest.path.should.be.eql(this.requestWithVersion.path);
    clonedRequest.version.should.be.eql(this.requestWithVersion.version);
    clonedRequest.method.should.be.eql(this.requestWithVersion.method);
    clonedRequest.withCredentials.should.be.eql(this.requestWithVersion.withCredentials);
    clonedRequest.responseType.should.be.eql(this.requestWithVersion.responseType);
    clonedRequest.getHeaders().should.be.eql(this.requestWithVersion.getHeaders());
    clonedRequest.getQuery().should.be.eql(this.requestWithVersion.getQuery());

    const clonedRequestNoVersion = this.requestNoVersion.clone();
    clonedRequestNoVersion.getHeaders().should.be.eql(new HttpHeaders({ header: 'header' }));
    clonedRequestNoVersion.getQuery().should.be.eql(new HttpParams({ query: 'query' }));

    let headers = this.requestWithVersion.getHeaders();
    headers = headers.append('name', 'value');
    const headersRequest = this.requestWithVersion.clone({ headers });
    headersRequest.path.should.be.eql('/v1/path');
    headersRequest.version.should.be.eql('v1');
    headersRequest.getHeaders().should.be.eql(headers);

    const headersRequest1 = this.requestWithVersion.clone({});
    headersRequest1.path.should.be.eql('/v1/path');
    headersRequest1.version.should.be.eql('v1');
  }

  @test 'should clone the request with information'() {

    let headers = this.requestWithVersion.getHeaders();
    headers = headers.append('name', 'value');

    let query = this.requestWithVersion.getQuery();
    query = query.append('name', 'value');

    const clonedRequest = this.requestWithVersion.clone({
      path: '/newPath',
      method: HttpMethod.DELETE,
      withCredentials: false,
      responseType: HttpResponseContent.TEXT,
      headers,
      query
    });

    clonedRequest.path.should.be.eql('/v1/newPath');
    clonedRequest.version.should.be.eql('v1');
    clonedRequest.method.should.be.eql(HttpMethod.DELETE);
    clonedRequest.withCredentials.should.be.false;
    clonedRequest.responseType.should.be.eql(HttpResponseContent.TEXT);
    clonedRequest.getHeaders().should.be.eql(headers);
    clonedRequest.getQuery().should.be.eql(query);
  }

}
