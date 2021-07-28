import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { Handler } from '../../../../../src/lib/decorator/handler';
import { DecoratorHandlerLookup } from '../../../../../src/lib/message-handler/handler-lookup/decorator/decorator.handler-lookup';

class HandlerTest {}

@Handler(HandlerTest)
class MessageTest {}
class MessageAnotherTest {}

@suite
class DecoratorHandlerLookupUnitTest {

  private SUT: DecoratorHandlerLookup;

  before() {
    this.SUT = new DecoratorHandlerLookup();
  }

  @test
  givenMessage_whenGetValue_thenReturnIt() {
    expect(this.SUT.getValue(MessageTest)).toBe(HandlerTest);
  }

  @test
  givenMessage_whenGetValue_thenThrowError() {
    expect(() => this.SUT.getValue(MessageAnotherTest)).toThrow(Error);
  }
}
