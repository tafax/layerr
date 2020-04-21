
import { suite, test } from '@layerr/test';
import { HttpHeaders } from '../../../src/utilities/http-headers';

@suite class HttpHeadersUnitTests {

  private headers: HttpHeaders;

  before() {
    this.headers = new HttpHeaders();
  }

  @test 'should append a new value'() {
    this.headers.append('name', 'value');
    this.headers.get('name').should.be.eql('value');
  }

  @test 'should set a new value'() {
    this.headers.set('name', 'value');
    this.headers.get('name').should.be.eql('value');
  }

  @test 'should has a value'() {
    this.headers.set('name', 'value');
    this.headers.has('name').should.be.true;
  }

  @test 'should delete a value'() {
    this.headers.set('name', 'value');
    this.headers.has('name').should.be.true;
    this.headers.delete('name');
    this.headers.has('name').should.be.false;
  }

  @test 'should allow to call the forEach'() {
    this.headers.set('name', 'value');
    this.headers.forEach(
      (value, name) => {
        name.should.be.eql('name');
        value.should.be.eql('value');
      },
      this
    );
  }

}
