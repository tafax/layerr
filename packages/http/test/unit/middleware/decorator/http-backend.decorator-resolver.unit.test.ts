import { JsonType } from '@layerr/core';
import { suite, test } from '@testdeck/jest';
import { HttpBackend } from '../../../../src/lib/middleware/http-backend/decorator/http-backend';
import {
  HttpBackendDecoratorResolver,
} from '../../../../src/lib/middleware/http-backend/decorator/http-backend.decorator-resolver';
import { RequestInterface, RequestUpdate } from '../../../../src/lib/request/request.interface';
import { HttpHeaders } from '../../../../src/lib/utilities/http-headers';
import { HttpMethod } from '../../../../src/lib/utilities/http-method';
import { HttpParams } from '../../../../src/lib/utilities/http-params';
import { HttpResponseContent } from '../../../../src/lib/utilities/http-response-content';

@HttpBackend('BACKEND')
class Message implements RequestInterface {
  public version: string;
  public path: string;
  public method: HttpMethod;
  public withCredentials: boolean;
  public responseType: HttpResponseContent;
  getHeaders(): HttpHeaders {
    throw new Error('Method not implemented.');
  }
  getQuery(): HttpParams {
    throw new Error('Method not implemented.');
  }
  getBody(): JsonType {
    throw new Error('Method not implemented.');
  }
  clone(update?: RequestUpdate): RequestInterface {
    throw new Error('Method not implemented.');
  }
}

@suite
class HttpBackendDecoratorResolverUnitTest {

  private SUT: HttpBackendDecoratorResolver<unknown>;

  before() {
    this.SUT = new HttpBackendDecoratorResolver();
  }

  @test
  givenMessage_whenGetValue_thenReturnTheValue() {
    expect(this.SUT.getValue(Message)).toBe('BACKEND');
  }
}
