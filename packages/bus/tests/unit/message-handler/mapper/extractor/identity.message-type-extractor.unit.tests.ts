
import { suite, test } from '@layerr/test';
import { IdentityMessageTypeExtractor } from '../../../../../src/message-handler/message-mapper/extractor/identity.message-type-extractor';

//@ts-ignore
@suite class IdentityMessageTypeExtractorUnitTests {

  private extractor: IdentityMessageTypeExtractor;

  before() {
    this.extractor = new IdentityMessageTypeExtractor();
  }

  @test 'should extract the identity of an object'() {
    class TestClassToExtract {}
    const message = new TestClassToExtract();
    this.extractor.extract(message).should.be.eql(message);
    this.extractor.extract('message').should.be.eql('message');
  }

}
