import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { IdentityMessageTypeExtractor } from '../../../../src/lib/message-handler/extractor/identity.message-type-extractor';

@suite class IdentityMessageTypeExtractorUnitTest {

  private SUT: IdentityMessageTypeExtractor;

  before() {
    this.SUT = new IdentityMessageTypeExtractor();
  }

  @test 'should extract the identity of an object'() {
    class TestClassToExtract {}
    expect(this.SUT.extract(TestClassToExtract)).toStrictEqual(TestClassToExtract);
    expect(this.SUT.extract('message')).toStrictEqual('message');
  }
}
