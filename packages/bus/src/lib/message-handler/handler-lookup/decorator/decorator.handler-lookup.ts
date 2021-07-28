import { DecoratorMetadataResolver, ClassType } from '@layerr/core';
import { HandlerLookupInterface } from '../handler-lookup.interface';
import { BusDecoratorKeys } from './bus-decorator.keys';

export class DecoratorHandlerLookup implements HandlerLookupInterface {

  private readonly _extractor: DecoratorMetadataResolver = new DecoratorMetadataResolver(BusDecoratorKeys.DECORATOR_OPTIONS);

  /**
   * @inheritDoc
   */
  getValue(message: ClassType<unknown>): unknown {
    return this._extractor.getMetadata(message);
  }
}
