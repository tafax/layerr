import { ClassType } from '../../utilities/class-type';

/**
 * Defines the interface to use a service container.
 */
export interface ServiceContainerInterface {

  /**
   * Retrieves an instance from the injector based on the provided token.
   * @param token The token to identify the service.
   * @param notFoundValue The default value if the token is not found.
   * @returns The instance from the injector if defined, otherwise the `notFoundValue`.
   */
  get<T>(token: ClassType<T>, notFoundValue?: T): T;
}
