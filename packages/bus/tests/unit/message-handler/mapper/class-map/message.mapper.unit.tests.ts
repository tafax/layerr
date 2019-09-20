
import { ClassResolverInterface, ClassType } from '@swiss/core';
import { suite, test, IMock, Mock, Times, It } from '@swiss/test';
import { MessageMapper, MessageTypeExtractorInterface, HandlerLookupInterface } from '../../../../../src/public_api';

//@ts-ignore
@suite class MessageMapperUnitTests {

  private messageMapper: MessageMapper;
  private messageLookupMock: IMock<HandlerLookupInterface>;
  private extractorMock: IMock<MessageTypeExtractorInterface>;
  private classResolverMock: IMock<ClassResolverInterface>;

  before() {

    this.messageLookupMock = Mock.ofType<HandlerLookupInterface>();
    this.extractorMock = Mock.ofType<MessageTypeExtractorInterface>();
    this.classResolverMock = Mock.ofType<ClassResolverInterface>();

    this.messageMapper = new MessageMapper(
      this.messageLookupMock.object,
      this.extractorMock.object,
      this.classResolverMock.object
    );
  }

  @test 'should return a set of callable functions based on a handler'() {

    const messageClassMock = Mock.ofType<ClassType<any>>();
    const messageMock = Mock.ofType<any>();

    const handlerClassMock = Mock.ofType<ClassType<any>>();
    const handlerMock = Mock.ofType<any>();

    handlerMock
      .setup(x => x.handle());

    this.extractorMock
      .setup(x => x.extract(messageMock.object))
      .returns(() => messageClassMock.object)
      .verifiable(Times.once());

    this.messageLookupMock
      .setup(x => x.getValue(messageClassMock.object))
      .returns(() => handlerClassMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(handlerClassMock.object))
      .returns(() => handlerMock.object)
      .verifiable(Times.once());

    const mappings = this.messageMapper.getHandlers(messageMock.object);
    mappings.should.have.length(1);
    mappings[0].should.instanceof(Function);

    this.extractorMock.verifyAll();
    this.messageLookupMock.verifyAll();
    this.classResolverMock.verifyAll();
  }

  @test 'should return a set of callable functions'() {

    const messageClassMock = Mock.ofType<ClassType<any>>();
    const messageMock = Mock.ofType<any>();

    const handlers = [ () => {}, () => {} ];

    this.extractorMock
      .setup(x => x.extract(messageMock.object))
      .returns(() => messageClassMock.object)
      .verifiable(Times.once());

    this.messageLookupMock
      .setup(x => x.getValue(messageClassMock.object))
      .returns(() => handlers)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(It.isAny()))
      .verifiable(Times.never());

    const mappings = this.messageMapper.getHandlers(messageMock.object);
    mappings.should.have.length(2);
    mappings[0].should.instanceof(Function);
    mappings[1].should.instanceof(Function);

    this.extractorMock.verifyAll();
    this.messageLookupMock.verifyAll();
    this.classResolverMock.verifyAll();
  }

  @test 'should re-throw the error if the extractor throws an error'() {

    const messageMock = Mock.ofType<any>();

    this.extractorMock
      .setup(x => x.extract(messageMock.object))
      .throws(new Error('extractor-error'))
      .verifiable(Times.once());

    (() => { this.messageMapper.getHandlers(messageMock.object); }).should.throw('extractor-error');

    this.extractorMock.verifyAll();
  }

  @test 'should re-throw the error if the collection throws an error'() {

    const messageClassMock = Mock.ofType<ClassType<any>>();
    const messageMock = Mock.ofType<any>();

    this.extractorMock
      .setup(x => x.extract(messageMock.object))
      .returns(() => messageClassMock.object)
      .verifiable(Times.once());

    this.messageLookupMock
      .setup(x => x.getValue(messageClassMock.object))
      .throws(new Error('collection-error'))
      .verifiable(Times.once());

    (() => { this.messageMapper.getHandlers(messageMock.object); }).should.throw('collection-error');

    this.extractorMock.verifyAll();
    this.messageLookupMock.verifyAll();
  }

  @test 'should re-throw the error if the resolver throws an error'() {

    const messageClassMock = Mock.ofType<ClassType<any>>();
    const messageMock = Mock.ofType<any>();

    const handlerClassMock = Mock.ofType<any>();

    this.extractorMock
      .setup(x => x.extract(messageMock.object))
      .returns(() => messageClassMock.object)
      .verifiable(Times.once());

    this.messageLookupMock
      .setup(x => x.getValue(messageClassMock.object))
      .returns(() => handlerClassMock.object)
      .verifiable(Times.once());

    this.classResolverMock
      .setup(x => x.resolve(handlerClassMock.object))
      .throws(new Error('resolver-error'))
      .verifiable(Times.once());

    (() => { this.messageMapper.getHandlers(messageMock.object); }).should.throw('resolver-error');

    this.extractorMock.verifyAll();
    this.messageLookupMock.verifyAll();
    this.classResolverMock.verifyAll();
  }

}
