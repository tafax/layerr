import { CoreError } from '../../errors/core.error';
import { ClassType } from '../../utilities/class-type';
import { ServiceContainerInterface } from './service-container.interface';
import { ClassResolverInterface } from '../class-resolver.interface';

/**
 * Defines the resolver to use a service container to create a listener when needed.
 */
export class ServiceContainerClassResolver implements ClassResolverInterface {
  constructor(
    private readonly _serviceContainer: ServiceContainerInterface,
  ) {}

  /**
   * The service container.
   */
  get serviceContainer(): ServiceContainerInterface {
    return this._serviceContainer;
  }

  /**
   * @inheritDoc
   */
  resolve<T>(classType: ClassType<T>): T {
    const classObject = this._serviceContainer.get<T>(classType);
    if (!classObject) {
      throw new CoreError(`Unable to find a resolved value for "${classType}".`);
    }
    return classObject;
  }
}
