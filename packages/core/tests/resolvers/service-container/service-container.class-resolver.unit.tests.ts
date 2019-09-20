
import { suite, test, Times, IMock, Mock, should } from '@layerr/test';
import { ServiceContainerClassResolver, ServiceContainerInterface, ClassType, CoreError } from '../../..';

//@ts-ignore
@suite class ServiceContainerClassResolverUnitTests {

  private serviceContainerClassResolver: ServiceContainerClassResolver;
  private serviceContainerMock: IMock<ServiceContainerInterface>;

  before() {

    this.serviceContainerMock = Mock.ofType<ServiceContainerInterface>();

    this.serviceContainerClassResolver = new ServiceContainerClassResolver(
      this.serviceContainerMock.object
    );
  }

  @test 'should return the service container'() {

    should.equal(this.serviceContainerClassResolver.serviceContainer, this.serviceContainerMock.object);
  }

  @test 'should resolve the service'() {

    const serviceMock = Mock.ofType<any>();
    const serviceClassMock = Mock.ofType<ClassType<any>>();

    this.serviceContainerMock
      .setup(x => x.get(serviceClassMock.object))
      .returns(() => serviceMock.object)
      .verifiable(Times.once());

    should.equal(this.serviceContainerClassResolver.resolve(serviceClassMock.object), serviceMock.object);

    this.serviceContainerMock.verifyAll();
  }

  @test 'should throw an error if the service does not exist'() {

    const serviceClassMock = Mock.ofType<ClassType<any>>();

    this.serviceContainerMock
      .setup(x => x.get(serviceClassMock.object))
      .returns(() => undefined)
      .verifiable(Times.once());

    (() => {
      this.serviceContainerClassResolver.resolve(serviceClassMock.object);
    }).should.throw(CoreError);

    this.serviceContainerMock.verifyAll();
  }

}
