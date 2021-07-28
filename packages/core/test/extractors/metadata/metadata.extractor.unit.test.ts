import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { CoreError } from '../../../src/lib/errors/core.error';
import { DecoratorMetadataResolver } from '../../../src/lib/metadata-resolver/metadata/decorator.metadata-resolver';

@suite class MetadataExtractorUnitTest {

  private SUT: DecoratorMetadataResolver;

  before() {
    this.SUT = new DecoratorMetadataResolver('key');
  }

  @test givenNotDecoratedClass_whenGetMetadata_thenThrowError() {
    class TestClass { }
    expect(() => this.SUT.getMetadata(TestClass)).toThrow(CoreError);
  }

  @test givenDecoratedClass_whenGetMetadata_thenReturnIt() {
    const options = {};

    class TestClass { }
    TestClass.prototype[Symbol.for('key')] = options;

    expect(this.SUT.getMetadata(TestClass)).toStrictEqual(options);
  }
}
