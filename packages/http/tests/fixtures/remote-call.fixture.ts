
import { JsonType } from '@swiss/core';
import { RemoteCall } from '../../src/decorators/decorators';
import { RemoteCallInterface } from '../../src/remote-call/remote-call.interface';
import { HttpHeaders } from '../../src/utilities/http-headers';
import { HttpMethod } from '../../src/utilities/http-method';
import { HttpParams } from '../../src/utilities/http-params';
import { HttpResponseContent } from '../../src/utilities/http-response-content';
import { RemoteCallHandlerFixture } from './remote-call-handler.fixture';

@RemoteCall({
  handler: RemoteCallHandlerFixture
})
export class RemoteCallFixture implements RemoteCallInterface {

  /**
   * @inheritDoc
   */
  method: HttpMethod;

  /**
   * @inheritDoc
   */
  withCredentials: boolean = false;

  /**
   * @inheritDoc
   */
  responseType: HttpResponseContent;

  constructor(
    private _path: string
  ) {}

  /**
   * The path for this action.
   */
  get path(): string {
    return this._path;
  }

  /**
   * @inheritDoc
   */
  getHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  /**
   * @inheritDoc
   */
  getQuery(): HttpParams {
    return new HttpParams();
  }

  /**
   * @inheritDoc
   */
  getBody(): JsonType {
    return null;
  }

}
