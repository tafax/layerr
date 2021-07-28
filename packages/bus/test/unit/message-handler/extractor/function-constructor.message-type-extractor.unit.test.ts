import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { FunctionConstructorMessageTypeExtractor } from '../../../../src/lib/message-handler/extractor/function-constructor.message-type-extractor';

@suite class FunctionConstructorMessageTypeExtractorUnitTest {

  private SUT: FunctionConstructorMessageTypeExtractor;

  before() {
    this.SUT = new FunctionConstructorMessageTypeExtractor();
  }

  @test givenObject_whenExtract_thenReturnClass() {
    class TestClassToExtract {}
    expect(this.SUT.extract(new TestClassToExtract())).toStrictEqual(TestClassToExtract);
  }
}
