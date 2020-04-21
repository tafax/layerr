
import { suite, should } from '@layerr/test';
import { AbstractRestfulRequest } from '../../../src/request/abstract-restful.request';
import { TestRestfulRequest } from '../../fixtures/test.restful-request';

@suite class AbstractRestfulRequestUnitTests {

  private requestWithVersion: AbstractRestfulRequest;
  private requestNoVersion: AbstractRestfulRequest;

  before() {
    this.requestWithVersion = new TestRestfulRequest('/path', 'v1');
    this.requestNoVersion = new TestRestfulRequest('/path', null);
  }

  @test 'should return the path'() {
    this.requestWithVersion.path.should.be.eql('/v1/path');
    this.requestNoVersion.path.should.be.eql('/path');
  }

  @test 'should return the version'() {
    this.requestWithVersion.version.should.be.eql('v1');
  }

  @test 'should return a null body'() {
    should.not.exist(this.requestWithVersion.getBody());
  }

  @test 'should return an empty headers map'() {
    this.requestWithVersion.getHeaders().should.not.be.null;
  }

  @test 'should return an empty query map'() {
    this.requestWithVersion.getQuery().should.not.be.null;
  }

}
