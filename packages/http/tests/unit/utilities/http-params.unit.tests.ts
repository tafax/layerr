
import { suite, test, should } from '@layerr/test';
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

    this.params.set('name1', undefined);
    should.not.exist(this.params.get('name1'));
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

  @test 'should get all the values for a specific key'() {
    this.params.set('name', 'value');
    this.params.getAll('name').should.be.eql([ 'value' ]);

    this.params.getAll('nokey').should.be.eql([]);
  }

  @test 'should return null if the key is not defined'() {
    should.not.exist(this.params.get('some'));
  }

  @test 'should return true if it is empty, false otherwise'() {
    this.params.isEmpty().should.be.true;

    this.params.set('name', 'value');

    this.params.isEmpty().should.be.false;
  }

  @test 'should return the correct query string'() {
    this.params.set('name', 'value');
    this.params.set('name?-', 'value value');

    const query = this.params.toString();
    query.should.be.eql('name=value&name%3F-=value%20value');

  }

}
