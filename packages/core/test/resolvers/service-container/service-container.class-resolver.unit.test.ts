import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { mock, instance, when } from 'ts-mockito';
import { CoreError } from '../../../src/lib/errors/core.error';
import { ServiceContainerClassResolver } from '../../../src/lib/resolvers/service-container/service-container.class-resolver';
import { ServiceContainerInterface } from '../../../src/lib/resolvers/service-container/service-container.interface';
import { ClassType } from '../../../src/lib/utilities/class-type';

@suite class ServiceContainerClassResolverUnitTest {

  private SUT: ServiceContainerClassResolver;
  private serviceContainer: ServiceContainerInterface;

  before() {
    this.serviceContainer = mock<ServiceContainerInterface>();

    this.SUT = new ServiceContainerClassResolver(
      instance(this.serviceContainer),
    );
  }

  @test whenGetServiceContainer_thenReturnIt() {
    expect(this.SUT.serviceContainer).toBe(instance(this.serviceContainer));
  }

  @test givenServiceClass_whenResolve_thenReturnService() {
    const service = mock();
    const serviceClass = mock<ClassType<unknown>>();

    when(this.serviceContainer.get(instance(serviceClass))).thenReturn(instance(service));

    expect(this.SUT.resolve(instance(serviceClass))).toBe(instance(service));
  }

  @test givenNotExistingServiceClass_whenResolve_throwError() {
    const serviceClass = mock<ClassType<unknown>>();

    when(this.serviceContainer.get(instance(serviceClass))).thenReturn(undefined);

    expect(() => this.SUT.resolve(instance(serviceClass))).toThrow(CoreError);
  }
}
