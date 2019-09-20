
import { ClassType } from '../utilities/class-type';

/**
 * Defines the interface to use in order to create a service
 * that is able to get the metadata info from a specific class type.
 */
export interface MetadataResolverInterface {

  /**
   * Gets the metadata from a class.
   */
  getMetadata<T, U>(target: ClassType<U>): T;

}
