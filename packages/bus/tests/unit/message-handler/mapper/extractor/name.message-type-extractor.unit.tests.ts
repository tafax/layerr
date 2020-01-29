
import { suite, test } from '@layerr/test';
import { NameMessageTypeExtractor } from "../../../../../src/message-handler/message-mapper/extractor/name.message-type-extractor";
import {BusError} from "../../../../../src/errors/bus.error";

//@ts-ignore
@suite class NameMessageTypeExtractorUnitTests {

  private extractor: NameMessageTypeExtractor;

  before() {
    this.extractor = new NameMessageTypeExtractor();
  }

  @test 'should extract the correct name of an object'() {
    class TestClassToExtract {
      get name() { return 'name'; }
    }
    this.extractor.extract(new TestClassToExtract()).should.be.eql('name');
  }

  @test 'should throw an exception if the name is not defined'() {
    class TestClassToExtract {}
    (() => {
      this.extractor.extract(new TestClassToExtract())
    }).should.throw(BusError);
  }

}
