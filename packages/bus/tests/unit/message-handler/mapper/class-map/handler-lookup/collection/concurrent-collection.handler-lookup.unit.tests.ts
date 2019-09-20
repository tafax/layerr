
import { suite, test, should } from '@swiss/test';
import { ConcurrentCollectionHandlerLookup } from '../../../../../../../src/public_api';

class MessageTest {}

class MessageHandlerTest {
  handler1() {}

  handler2() {}

  handler3() {}
}

//@ts-ignore
@suite class ConcurrentCollectionHandlerLookupUnitTests {

  private concurrentCollectionHandlerLookup: ConcurrentCollectionHandlerLookup;

  before() {
    this.concurrentCollectionHandlerLookup = new ConcurrentCollectionHandlerLookup();
  }

  @test 'should return undefined if no collection is provided'() {
    should.equal(this.concurrentCollectionHandlerLookup.getValue('message'), undefined);
    should.equal(this.concurrentCollectionHandlerLookup.getValue(MessageTest), undefined);
    should.equal(this.concurrentCollectionHandlerLookup.getMessage(() => {}), undefined);
  }

  @test 'should return the correct set of handlers given a message'() {

    const messageHandlerTest = new MessageHandlerTest();

    this.concurrentCollectionHandlerLookup.setCollection([
      {
        message: 'message',
        handler: [
          messageHandlerTest.handler1,
          messageHandlerTest.handler2
        ]
      },
      {
        message: MessageTest,
        handler: [ messageHandlerTest.handler3 ]
      }
    ]);
    this.concurrentCollectionHandlerLookup.getValue('message').should.be.eql([
      messageHandlerTest.handler1,
      messageHandlerTest.handler2
    ]);
    this.concurrentCollectionHandlerLookup.getValue(MessageTest).should.be.eql([
      messageHandlerTest.handler3
    ]);
  }

  @test 'should return the correct message given a handler'() {

    const messageHandlerTest = new MessageHandlerTest();

    this.concurrentCollectionHandlerLookup.setCollection([
      { message: 'message', handler: [ messageHandlerTest.handler2 ] },
      {
        message: MessageTest,
        handler: [
          messageHandlerTest.handler1,
          messageHandlerTest.handler3
        ]
      }
    ]);
    this.concurrentCollectionHandlerLookup.getMessage(messageHandlerTest.handler2).should.be.eql('message');
    this.concurrentCollectionHandlerLookup.getMessage(messageHandlerTest.handler1).should.be.eql(MessageTest);
    this.concurrentCollectionHandlerLookup.getMessage(messageHandlerTest.handler3).should.be.eql(MessageTest);
  }
}
