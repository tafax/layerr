
import { ClassType } from '@layerr/core';
import { suite, test, IMock, Mock, Times } from '@layerr/test';
import { MessageTypeExtractorInterface, HandlerLookupInterface, BusError } from '../../../../src/public_api';
import { FunctionMessageMapper } from '../../../../src/message-handler/message-mapper/function.message-mapper';

//@ts-ignore
@suite class FunctionMessageMapperUnitTests {

  private messageMapper: FunctionMessageMapper;
  private messageLookupMock: IMock<HandlerLookupInterface>;
  private extractorMock: IMock<MessageTypeExtractorInterface>;

  before() {

    this.messageLookupMock = Mock.ofType<HandlerLookupInterface>();
    this.extractorMock = Mock.ofType<MessageTypeExtractorInterface>();

    this.messageMapper = new FunctionMessageMapper(
      this.messageLookupMock.object,
      this.extractorMock.object
    );
  }

  @test 'should return a set of callable functions when the handler is an array of functions'() {

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

    const mappings = this.messageMapper.getHandlers(messageMock.object);
    mappings.should.have.length(2);
    mappings[0].should.be.instanceof(Function);
    mappings[1].should.be.instanceof(Function);

    this.extractorMock.verifyAll();
    this.messageLookupMock.verifyAll();
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

  @test 'should re-throw the error if the collection return is not an array nor a function'() {

    const messageClassMock = Mock.ofType<ClassType<any>>();
    const messageMock = Mock.ofType<any>();

    this.extractorMock
      .setup(x => x.extract(messageMock.object))
      .returns(() => messageClassMock.object)
      .verifiable(Times.once());

    this.messageLookupMock
      .setup(x => x.getValue(messageClassMock.object))
      .returns(() => '')
      .verifiable(Times.once());

    (() => { this.messageMapper.getHandlers(messageMock.object); }).should.throw(BusError);

    this.extractorMock.verifyAll();
    this.messageLookupMock.verifyAll();
  }

}
