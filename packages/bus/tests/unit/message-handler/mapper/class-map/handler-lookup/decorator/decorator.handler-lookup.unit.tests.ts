
import { suite, test, should } from '@layerr/test';
import { DecoratorHandlerLookup, Handler } from '../../../../../../../src/public_api';

class HandlerTest {}

@Handler(HandlerTest)
class MessageTest {}
class MessageAnotherTest {}

//@ts-ignore
@suite class DecoratorHandlerLookupUnitTests {

  private decoratorHandlerLookup: DecoratorHandlerLookup;

  before() {
    this.decoratorHandlerLookup = new DecoratorHandlerLookup();
  }

  @test 'should return the handler'() {
    should.equal(this.decoratorHandlerLookup.getValue(MessageTest), HandlerTest);
  }

  @test 'should throw an error'() {
    should.throw(() => {
      this.decoratorHandlerLookup.getValue(MessageAnotherTest);
    }, Error);
  }

}
