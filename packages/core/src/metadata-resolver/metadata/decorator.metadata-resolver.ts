
import { ClassType } from '../../utilities/class-type';
import { GetValue, IsDecorated } from '../../decorators/utilities';
import { MetadataResolverInterface } from '../metadata-resolver.interface';
import { CoreError } from '../../errors/core.error';

/**
 * Defines a metadata resolver based on decorator.
 */
export class DecoratorMetadataResolver implements MetadataResolverInterface {

  constructor(
    private _metadataKey: string
  ) {}

  /**
   * @inheritDoc
   */
  getMetadata<T, U>(target: ClassType<U>): T {
    // Checks if the class is correctly decorated.
    if (!IsDecorated(this._metadataKey, target)) {
      throw new CoreError(`Class ${target.name} is not decorated for metadata key ${this._metadataKey}`);
    }
    // Gets the ID associated to the channel.
    return GetValue(this._metadataKey, target);
  }

}
