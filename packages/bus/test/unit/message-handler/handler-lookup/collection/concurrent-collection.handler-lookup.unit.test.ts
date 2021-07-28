import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { ConcurrentCollectionHandlerLookup } from '../../../../../src/lib/message-handler/handler-lookup/collection/concurrent-collection.handler-lookup';

class MessageTest {}

class MessageHandlerTest {
  //eslint-disable-next-line @typescript-eslint/no-empty-function
  handler1() {}
  //eslint-disable-next-line @typescript-eslint/no-empty-function
  handler2() {}
  //eslint-disable-next-line @typescript-eslint/no-empty-function
  handler3() {}
}

@suite class ConcurrentCollectionHandlerLookupUnitTest {

  private SUT: ConcurrentCollectionHandlerLookup;

  before() {
    this.SUT = new ConcurrentCollectionHandlerLookup();
  }

  @test givenMessage_whenGetValue_thenReturnUndefined() {
    expect(this.SUT.getValue('message')).toBeUndefined();
    expect(this.SUT.getValue(MessageTest)).toBeUndefined();
  }

  @test givenValue_whenGetMessage_thenReturnUndefined() {
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(this.SUT.getMessage(() => {})).toBeUndefined();
  }

  @test givenMessage_whenGetValue_thenReturnIt() {
    const messageHandlerTest = new MessageHandlerTest();

    this.SUT.setCollection([
      {
        message: 'message',
        handler: [
          messageHandlerTest.handler1,
          messageHandlerTest.handler2,
        ],
      },
      {
        message: MessageTest,
        handler: [ messageHandlerTest.handler3 ],
      },
    ]);

    expect(this.SUT.getValue('message')).toStrictEqual([
      messageHandlerTest.handler1,
      messageHandlerTest.handler2,
    ]);

    expect(this.SUT.getValue(MessageTest)).toStrictEqual([
      messageHandlerTest.handler3,
    ]);
  }

  @test givenValue_whenGetMessage_thenReturnIt() {
    const messageHandlerTest = new MessageHandlerTest();

    this.SUT.setCollection([
      { message: 'message', handler: [ messageHandlerTest.handler2 ] },
      {
        message: MessageTest,
        handler: [
          messageHandlerTest.handler1,
          messageHandlerTest.handler3,
        ],
      },
    ]);

    expect(this.SUT.getMessage(messageHandlerTest.handler2)).toStrictEqual('message');
    expect(this.SUT.getMessage(messageHandlerTest.handler1)).toStrictEqual(MessageTest);
    expect(this.SUT.getMessage(messageHandlerTest.handler3)).toStrictEqual(MessageTest);
  }
}
