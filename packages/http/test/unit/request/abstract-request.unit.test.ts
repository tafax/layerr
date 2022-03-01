import { suite, test } from '@testdeck/jest';
import { HttpHeaders } from '../../../src/lib/utilities/http-headers';
import { HttpMethod } from '../../../src/lib/utilities/http-method';
import { HttpParams } from '../../../src/lib/utilities/http-params';
import { HttpRequestContent } from '../../../src/lib/utilities/http-request-content';
import { HttpResponseContent } from '../../../src/lib/utilities/http-response-content';
import { TestRequest } from '../../fixtures/test.request';

@suite
class AbstractRestfulRequestUnitTests {
  @test
  givenPath_whenGetPath_thenReturnIt() {
    const request = new TestRequest({
      path: '/path',
      version: null,
    });
    expect(request.path).toStrictEqual('/path');
  }

  @test
  givenPathAdnVersion_whenGetPath_returnPathPrefixedWithVersion() {
    const request = new TestRequest({
      path: '/path',
      version: 'v1',
    });
    expect(request.version).toStrictEqual('v1');
    expect(request.path).toStrictEqual('/v1/path');
  }

  @test
  whenGetBody_thenReturnNull() {
    const request = new TestRequest({
      path: '/path',
      version: 'v1',
    });
    expect(request.getBody()).toBeNull();
  }

  @test
  whenGetHeaders_thenReturnEmptyHttpHeaders() {
    const request = new TestRequest({
      path: '/path',
      version: 'v1',
    });
    expect(request.getHeaders()).toStrictEqual(new HttpHeaders());
  }

  @test
  givenHeaders_whenGetHeaders_returnHeadersMap() {
    const request = new TestRequest({
      path: '/path',
      version: null,
      headers: {
        header: 'header',
      },
    });
    expect(request.getHeaders()).toStrictEqual(new HttpHeaders({ header: 'header' }));
  }

  @test
  whenGetQuery_thenReturnEmptyHttpParams() {
    const request = new TestRequest({
      path: '/path',
      version: 'v1',
    });
    expect(request.getQuery()).toStrictEqual(new HttpParams());
  }

  @test
  givenQuery_whenGetQuery_returnQueryMap() {
    const request = new TestRequest({
      path: '/path',
      version: null,
      query: {
        query: 'query',
      },
    });
    expect(request.getQuery()).toStrictEqual(new HttpParams({ query: 'query' }));
  }

  @test whenClone_thenReturnCloned() {
    const request = new TestRequest({
      path: '/path',
      version: 'v1',
      headers: {
        header: 'header',
      },
      query: {
        query: 'query',
      },
    });
    const clonedRequest = request.clone();
    expect(clonedRequest.path).toBe(request.path);
    expect(clonedRequest.version).toBe(request.version);
    expect(clonedRequest.method).toBe(request.method);
    expect(clonedRequest.contentType).toBe(request.contentType);
    expect(clonedRequest.withCredentials).toBe(request.withCredentials);
    expect(clonedRequest.responseType).toBe(request.responseType);
    expect(clonedRequest.getHeaders()).toStrictEqual(request.getHeaders());
    expect(clonedRequest.getQuery()).toStrictEqual(request.getQuery());

    const headers = request.getHeaders();
    const appendedHeaders = headers.append('name', 'value');
    const headersRequest = request.clone({
      headers: appendedHeaders,
    });
    expect(headersRequest.path).toBe('/v1/path');
    expect(headersRequest.version).toBe('v1');
    expect(headersRequest.getHeaders()).toStrictEqual(appendedHeaders);
  }

  @test
  givenParams_whenClone_thenReturnClonedRequest() {
    const request = new TestRequest({
      path: '/path',
      version: 'v1',
      headers: {
        header: 'header',
      },
      query: {
        query: 'query',
      },
    });

    const clonedRequest = request.clone({
      path: '/newPath',
      method: HttpMethod.DELETE,
      withCredentials: false,
      contentType: HttpRequestContent.MULTIPART_FORM_DATA,
      responseType: HttpResponseContent.TEXT,
      headers: request.getHeaders().append('name', 'value'),
      query: request.getQuery().append('name', 'value'),
    });

    expect(clonedRequest.path).toBe('/v1/newPath');
    expect(clonedRequest.version).toBe('v1');
    expect(clonedRequest.method).toBe(HttpMethod.DELETE);
    expect(clonedRequest.withCredentials).toBeFalsy();
    expect(clonedRequest.contentType).toBe(HttpRequestContent.MULTIPART_FORM_DATA);
    expect(clonedRequest.responseType).toBe(HttpResponseContent.TEXT);
    expect(clonedRequest.getHeaders()).toStrictEqual(request.getHeaders().append('name', 'value'));
    expect(clonedRequest.getQuery()).toStrictEqual(request.getQuery().append('name', 'value'));
  }

  @test
  givenPath_whenCloneMultipleTimes_thenDoNotDuplicateVersion() {
    const request = new TestRequest({
      path: '/path',
      version: 'v1',
      headers: {
        header: 'header',
      },
      query: {
        query: 'query',
      },
    });

    const firstUpdate = request.clone({ path: '/firstPath' });
    expect(firstUpdate.path).toBe('/v1/firstPath');

    const secondUpdate = firstUpdate.clone({ path: '/secondPath' });
    expect(secondUpdate.path).toBe('/v1/secondPath');

    const firstNoUpdate = secondUpdate.clone();
    expect(firstNoUpdate.path).toBe('/v1/secondPath');

    const secondNoUpdate = firstNoUpdate.clone();
    expect(secondNoUpdate.path).toBe('/v1/secondPath');
  }
}
