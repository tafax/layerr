
import { suite, test } from '@layerr/test';
import { FunctionConstructorMessageTypeExtractor } from '../../../../../../src/public_api';

//@ts-ignore
@suite class FunctionConstructorMessageTypeExtractorUnitTests {

  private extractor: FunctionConstructorMessageTypeExtractor;

  before() {
    this.extractor = new FunctionConstructorMessageTypeExtractor();
  }

  @test 'should extract the correct class to an object'() {
    class TestClassToExtract {}
    this.extractor.extract(new TestClassToExtract()).should.be.eql(TestClassToExtract);
  }

}
