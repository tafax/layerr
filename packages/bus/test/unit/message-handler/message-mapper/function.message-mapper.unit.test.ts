import { expect } from '@jest/globals';
import { suite, test, params } from '@testdeck/jest';
import { mock, instance, when } from 'ts-mockito';
import { MessageTypeExtractorInterface } from '../../../../src/lib/message-handler/extractor/message-type-extractor.interface';
import { HandlerLookupInterface } from '../../../../src/lib/message-handler/handler-lookup/handler-lookup.interface';
import { FunctionMessageMapper } from '../../../../src/lib/message-handler/message-mapper/function.message-mapper';

@suite class FunctionMessageMapperUnitTest {

  private SUT: FunctionMessageMapper;
  private handlerLookup: HandlerLookupInterface;
  private messageTypeExtractor: MessageTypeExtractorInterface;

  before() {
    this.handlerLookup = mock<HandlerLookupInterface>();
    this.messageTypeExtractor = mock<MessageTypeExtractorInterface>();

    this.SUT = new FunctionMessageMapper(
      instance(this.handlerLookup),
      instance(this.messageTypeExtractor),
    );
  }

  private static Provider(): [ unknown, unknown, Function[] ][] {
    return [
      [
        'message',
        'messageType',
        [
          () => undefined,
          () => undefined,
        ],
      ],
      [
        'message',
        () => '',
        [
          () => undefined,
          () => undefined,
        ],
      ],
    ];
  }

  @params(FunctionMessageMapperUnitTest.Provider()[0])
  @params(FunctionMessageMapperUnitTest.Provider()[1])
  @test givenMessage_whenGetHandlers_thenReturnThem() {
    const message = 'message';
    const messageType = 'messageType';
    const handlers = [
      () => undefined,
      () => undefined,
    ];

    when(this.messageTypeExtractor.extract(message)).thenReturn(messageType);
    when(this.handlerLookup.getValue(messageType)).thenReturn(handlers);

    const mappings = this.SUT.getHandlers(message);

    expect(mappings).toHaveLength(2);
    expect(mappings[0]).toBeInstanceOf(Function);
    expect(mappings[1]).toBeInstanceOf(Function);
  }
}
