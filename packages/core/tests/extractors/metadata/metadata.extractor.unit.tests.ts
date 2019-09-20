
import { suite, test, should } from '@swiss/test';
import { CoreError } from '../../../src/errors/core.error';
import { DecoratorMetadataResolver } from '../../../src/metadata-resolver/metadata/decorator.metadata-resolver';

//@ts-ignore
@suite class MetadataExtractorUnitTests {

  private metadataExtractor: DecoratorMetadataResolver;
  
  before() {
    this.metadataExtractor = new DecoratorMetadataResolver('key');
  }

  @test 'should throw an error if the class has not been decorated'() {

    class TestClass { }
    should.throw(() => this.metadataExtractor.getMetadata(TestClass), CoreError);
  }

  @test 'should extract the options from the given class'() {

    const options = {};

    class TestClass { }
    TestClass.prototype[Symbol.for('key')] = options;

    this.metadataExtractor.getMetadata(TestClass).should.be.eql(options);
  }
  
}
