import { ClassType } from '../utilities/class-type';

/**
 * Defines the interface to define a resolver used to create a fresh instance when needed.
 */
export interface ClassResolverInterface {
  /**
   * Resolves an returns an instance of a given class type.
   * @param classType The class type to resolve.
   */
  resolve<T>(classType: ClassType<T>): T;
}
