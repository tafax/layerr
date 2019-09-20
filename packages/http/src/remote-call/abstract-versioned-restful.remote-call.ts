
import { AbstractRestfulRemoteCall } from './abstract-restful.remote-call';

/**
 * Defines the abstract restful base class to perform requests against a versioned API. This class provides in addition to
 * the features offered by the abstract class AbstractRestfulRemoteCall (from with it inherit) also the possibility to
 * specify the version of the path to use. Extends this class every time you need to create a Restful request to communicate
 * with a versioned API.
 */
export class AbstractVersionedRestfulRemoteCall extends AbstractRestfulRemoteCall {

  /**
   * @param _path The complete path for this action that will be used for the request.
   * @param _version The version of the path to use. The default version is 'v1'
   */
  constructor(
    _path: string,
    private _version: string = 'v1'
  ) {
    super(_path);
  }

  /**
   * The path for this action concatenated to its version.
   */
  get path(): string {
    return `/${this._version}${this._path}`;
  }

}
