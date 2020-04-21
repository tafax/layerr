
import { suite, test } from '@layerr/test';
import { HttpParams } from '../../../src/utilities/http-params';

@suite class HttpParamsUnitTests {

  private params: HttpParams;

  before() {
    this.params = new HttpParams();
  }

  @test 'should append a new value'() {
    this.params.append('name', 'value');
    this.params.get('name').should.be.eql('value');
  }

  @test 'should set a new value'() {
    this.params.set('name', 'value');
    this.params.get('name').should.be.eql('value');
  }

  @test 'should has a value'() {
    this.params.set('name', 'value');
    this.params.has('name').should.be.true;
  }

  @test 'should delete a value'() {
    this.params.set('name', 'value');
    this.params.has('name').should.be.true;
    this.params.delete('name');
    this.params.has('name').should.be.false;
  }

  @test 'should allow to call the forEach'() {
    this.params.set('name', 'value');
    this.params.forEach(
      (value, name) => {
        name.should.be.eql('name');
        value.should.be.eql('value');
      },
      this
    );
  }

}
