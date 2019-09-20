
import { JsonType } from '@swiss/core';
import { HttpHeaders } from '../utilities/http-headers';
import { HttpParams } from '../utilities/http-params';
import { AbstractVersionedRestfulRemoteCall } from './abstract-versioned-restful.remote-call';
import { RemoteCallInterface } from './remote-call.interface';

/**
 * Defines the abstract composite remote call that can be used to combine multiple remote calls conform to RemoteCallInterface
 * in a single body with given keys.
 */
export abstract class AbstractCompositeVersionedRestfulRemoteCall extends AbstractVersionedRestfulRemoteCall {

  /**
   * The set of fragments (basic remote calls) that will be combined in a single remote call.
   */
  protected _fragments: Map<string, RemoteCallInterface>;

  constructor(
    _path: string,
    _fragments: [[ string, RemoteCallInterface ]],
    _version: string = 'v1'
  ) {
    super(_path, _version);

    this._fragments = new Map(_fragments);
  }

  /**
   * @inheritDoc
   */
  getHeaders(): HttpHeaders {
    const headers = new HttpHeaders();

    // Merges all the fragment headers
    for (const fragment of Array.from(this._fragments.values())) {
      const fragmentHeaders = fragment.getHeaders();
      Array.from(fragmentHeaders.keys())
        .forEach(
          (name: string) => headers.set(name, fragmentHeaders.get(name))
        );
    }

    return headers;
  }

  /**
   * @inheritDoc
   */
  getQuery(): HttpParams {
    const query = new HttpParams();

    // Merges all the fragments query params
    for (const fragment of Array.from(this._fragments.values())) {
      const fragmentQuery = fragment.getQuery();
      Array.from(fragmentQuery.keys())
        .forEach(
          (name: string) => query.set(name, fragmentQuery.get(name))
        );
    }

    return query;
  }

  /**
   * @inheritDoc
   */
  getBody(): JsonType {
    const body = {};

    // Merges all the fragments bodies mapping them to the provided keys
    for (const key in this._fragments) {
      if (!this._fragments.has(key)) {
        continue;
      }
      Object.assign(body, { [key]: this._fragments[key].getBody() });
    }

    return body;
  }

}
