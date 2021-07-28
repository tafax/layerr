import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { mock, instance, when } from 'ts-mockito';
import { ClassResolverInterface } from '../../../../../core/src/lib/resolvers/class-resolver.interface';
import { ClassType } from '../../../../../core/src/lib/utilities/class-type';
import { MessageTypeExtractorInterface } from '../../../../src/lib/message-handler/extractor/message-type-extractor.interface';
import { HandlerLookupInterface } from '../../../../src/lib/message-handler/handler-lookup/handler-lookup.interface';
import { MessageMapper } from '../../../../src/lib/message-handler/message-mapper/message.mapper';

@suite class MessageMapperUnitTest {

  private SUT: MessageMapper;
  private handlerLookup: HandlerLookupInterface;
  private messageTypeExtractor: MessageTypeExtractorInterface;
  private classResolver: ClassResolverInterface;

  before() {
    this.handlerLookup = mock<HandlerLookupInterface>();
    this.messageTypeExtractor = mock<MessageTypeExtractorInterface>();
    this.classResolver = mock<ClassResolverInterface>();

    this.SUT = new MessageMapper(
      instance(this.handlerLookup),
      instance(this.messageTypeExtractor),
      instance(this.classResolver),
    );
  }

  @test 'should return a set of callable functions based on a handler'() {
    const message = 'message';
    const messageType = 'messageType';

    const handler = { handle: () => '' };
    const handlerType = mock<ClassType<unknown>>();

    when(this.messageTypeExtractor.extract(message)).thenReturn(messageType);
    when(this.handlerLookup.getValue(messageType)).thenReturn(handlerType);
    when(this.classResolver.resolve(handlerType)).thenReturn(handler);

    const mappings = this.SUT.getHandlers(message);
    expect(mappings).toHaveLength(1);
    expect(mappings[0]).toBeInstanceOf(Function);
  }
}
