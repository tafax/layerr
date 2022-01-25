
import { HandlerLookupInterface } from '@layerr/bus';
import { DecoratorMetadataResolver, ClassType } from '@layerr/core';
import { RequestInterface } from '../../../request/request.interface';
import { HttpBackendKeys } from './http-backend.keys';

export class HttpBackendDecoratorResolver<T> implements HandlerLookupInterface {

  private readonly _extractor: DecoratorMetadataResolver = new DecoratorMetadataResolver(HttpBackendKeys.HTTP_BACKEND_OPTION);

  /**
   * @inheritDoc
   */
  getValue(message: ClassType<RequestInterface>): T {
    return this._extractor.getMetadata(message);
  }

}
