import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { BusError } from '../../../../../src/lib/errors/bus.error';
import { CollectionHandlerLookup } from '../../../../../src/lib/message-handler/handler-lookup/collection/collection.handler-lookup';

class MessageTest {}
class MessageHandlerTest {}

@suite class CollectionHandlerLookupUnitTest {

  private SUT: CollectionHandlerLookup;

  before() {
    this.SUT = new CollectionHandlerLookup();
  }

  @test givenMessage_whenGetValue_thenReturnUndefined() {
    expect(this.SUT.getValue('message')).toBeUndefined();
    expect(this.SUT.getValue(MessageTest)).toBeUndefined();
  }

  @test givenValue_whenGetMessage_thenReturnUndefined() {
    expect(this.SUT.getMessage('handler')).toBeUndefined();
    expect(this.SUT.getMessage(MessageHandlerTest)).toBeUndefined();
  }

  @test givenMessage_whenGetValue_thenReturnHandler() {
    this.SUT.setCollection([
      { message: 'message', handler: 'handler' },
      { message: MessageTest, handler: MessageHandlerTest },
    ]);

    expect(this.SUT.getValue('message')).toStrictEqual('handler');
    expect(this.SUT.getValue(MessageTest)).toStrictEqual(MessageHandlerTest);
  }

  @test givenValue_whenGetMessage_thenReturnMessage() {
    this.SUT.setCollection([
      { message: 'message', handler: 'handler' },
      { message: MessageTest, handler: MessageHandlerTest },
    ]);

    expect(this.SUT.getMessage('handler')).toStrictEqual('message');
    expect(this.SUT.getMessage(MessageHandlerTest)).toStrictEqual(MessageTest);
  }

  @test givenDuplicatedEntry_whenSetCollection_thenThrowError() {
    expect(() => {
      this.SUT.setCollection([
        { message: 'message', handler: 'handler' },
        { message: 'message', handler: 'another handler' },
        { message: MessageTest, handler: MessageHandlerTest },
      ]);
    }).toThrow(BusError);

    expect(() => {
      this.SUT.setCollection([
        { message: 'message', handler: 'handler' },
        { message: MessageTest, handler: MessageHandlerTest },
        { message: MessageTest, handler: Function },
      ]);
    }).toThrow(BusError);
  }
}
