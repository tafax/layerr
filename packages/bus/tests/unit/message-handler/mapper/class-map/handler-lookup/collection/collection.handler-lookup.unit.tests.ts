
import { suite, test, should } from '@swiss/test';
import { CollectionHandlerLookup } from '../../../../../../../src/public_api';
import { BusError } from '../../../../../../../src/errors/bus.error';

class MessageTest {}
class MessageHandlerTest {}

//@ts-ignore
@suite class CollectionHandlerLookupUnitTests {

  private collectionHandlerLookup: CollectionHandlerLookup;

  before() {
    this.collectionHandlerLookup = new CollectionHandlerLookup();
  }

  @test 'should return undefined if no collection is provided'() {
    should.equal(this.collectionHandlerLookup.getValue('message'), undefined);
    should.equal(this.collectionHandlerLookup.getMessage('handler'), undefined);
    should.equal(this.collectionHandlerLookup.getValue(MessageTest), undefined);
    should.equal(this.collectionHandlerLookup.getMessage(MessageHandlerTest), undefined);
  }

  @test 'should return the correct handlers given a message'() {
    this.collectionHandlerLookup.setCollection([
      { message: 'message', handler: 'handler' },
      { message: MessageTest, handler: MessageHandlerTest }
    ]);
    this.collectionHandlerLookup.getValue('message').should.be.eql('handler');
    this.collectionHandlerLookup.getValue(MessageTest).should.be.eql(MessageHandlerTest);
  }

  @test 'should return the correct message given a handler'() {
    this.collectionHandlerLookup.setCollection([
      { message: 'message', handler: 'handler' },
      { message: MessageTest, handler: MessageHandlerTest }
    ]);
    this.collectionHandlerLookup.getMessage('handler').should.be.eql('message');
    this.collectionHandlerLookup.getMessage(MessageHandlerTest).should.be.eql(MessageTest);
  }

  @test 'should throw error if there are duplications in the collection using string'() {
    (() => {
      this.collectionHandlerLookup.setCollection([
        { message: 'message', handler: 'handler' },
        { message: 'message', handler: 'another handler' },
        { message: MessageTest, handler: MessageHandlerTest }
      ]);
    }).should.throw(BusError);
  }

  @test 'should throw error if there are duplications in the collection using classes'() {
    (() => {
      this.collectionHandlerLookup.setCollection([
        { message: 'message', handler: 'handler' },
        { message: MessageTest, handler: MessageHandlerTest },
        { message: MessageTest, handler: Function }
      ]);
    }).should.throw(BusError);
  }
}
