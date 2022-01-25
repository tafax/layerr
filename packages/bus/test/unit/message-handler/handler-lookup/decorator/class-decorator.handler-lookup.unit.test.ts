import { suite, test } from '@testdeck/jest';
import { BusError } from '../../../../../src/lib/errors/bus.error';
import { ClassDecoratorHandlerLookup } from '../../../../../src/lib/message-handler/handler-lookup/decorator/class-decorator.handler-lookup';

class Message {}
class OtherMessage {}
class Handler {}

@suite
export class ClassDecoratorHandlerLookupUnitTest {

  private SUT: ClassDecoratorHandlerLookup;

  before() {
    this.SUT = new ClassDecoratorHandlerLookup();

    ClassDecoratorHandlerLookup.Register(Message, Handler);
  }

  @test
  givenRegistryEntry_whenGetValue_thenReturnClass() {
    expect(this.SUT.getValue(Message)).toBe(Handler);
  }

  @test
  givenNoRegistryEntry_whenGetValue_thenThrowError() {
    expect(() => this.SUT.getValue(OtherMessage)).toThrow(BusError);
  }
}
