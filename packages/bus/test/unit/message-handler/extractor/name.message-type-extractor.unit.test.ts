import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { NameMessageTypeExtractor } from "../../../../src/lib/message-handler/extractor/name.message-type-extractor";
import { BusError } from "../../../../src/lib/errors/bus.error";

@suite class NameMessageTypeExtractorUnitTest {

  private SUT: NameMessageTypeExtractor;

  before() {
    this.SUT = new NameMessageTypeExtractor();
  }

  @test 'should extract the correct name of an object'() {
    class TestClassToExtract {
      get name() { return 'name'; }
    }
    expect(this.SUT.extract(new TestClassToExtract())).toStrictEqual('name');
  }

  @test 'should throw an exception if the name is not defined'() {
    class TestClassToExtract {}
    expect(() => {
      this.SUT.extract(new TestClassToExtract())
    }).toThrow(BusError);
  }

}
