
import { suite, test, should } from '@layerr/test';
import { HttpParams } from '../../../src/utilities/http-params';

@suite class HttpParamsUnitTests {

  private params: HttpParams;

  before() {
    this.params = new HttpParams();
  }

  @test 'should clone'() {
    const params = this.params.append('name', 'value');
    params.get('name').should.be.eql('value');

    const cloned = params.clone();
    cloned.get('name').should.be.eql('value');
  }

  @test 'should append a new value'() {
    const params = this.params.append('name', 'value');
    params.get('name').should.be.eql('value');
    should.not.exist(this.params.get('name'));
  }

  @test 'should set a new value'() {
    const params = this.params.set('name', 'value');
    params.get('name').should.be.eql('value');
    should.not.exist(this.params.get('name'));

    const params2 = params.set('name1', undefined);
    should.not.exist(params2.get('name1'));
  }

  @test 'should has a value'() {
    const params = this.params.set('name', 'value');
    params.has('name').should.be.true;
    this.params.has('name').should.be.false;
  }

  @test 'should delete a value'() {
    let params = this.params.set('name', 'value');
    params = params.set('name', 'value');
    params = params.set('name1', 'value');
    params.has('name').should.be.true;
    params.has('name1').should.be.true;
    this.params.has('name').should.be.false;

    let params2 = params.delete('name');
    params2 = params2.delete('name2');
    params2.has('name').should.be.false;
    params2.has('name1').should.be.true;
  }

  @test 'should allow to call the forEach'() {
    const params = this.params.set('name', 'value');
    params.forEach(
      (value, name) => {
        name.should.be.eql('name');
        value.should.be.eql('value');
      },
      this
    );
  }

  @test 'should get all the values for a specific key'() {
    const params = this.params.set('name', 'value');
    params.getAll('name').should.be.eql([ 'value' ]);

    params.getAll('nokey').should.be.eql([]);
    this.params.getAll('nokey').should.be.eql([]);
  }

  @test 'should return null if the key is not defined'() {
    should.not.exist(this.params.get('some'));
  }

  @test 'should return true if it is empty, false otherwise'() {
    this.params.isEmpty().should.be.true;

    const params = this.params.set('name', 'value');

    params.isEmpty().should.be.false;
    this.params.isEmpty().should.be.true;
  }

  @test 'should return the correct query string'() {
    let params = this.params.set('name', 'value');
    params = params.set('name?-', 'value value');

    const query = params.toString();
    query.should.be.eql('name=value&name%3F-=value%20value');
  }

  @test 'should convert the query into a json object'() {
    let params = this.params.append('name1', 'value1');
    params = params.append('name2', 'value2');
    params = params.append('name3', 'value3');
    params.toObject().should.be.eql({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });
  }

  @test 'should create a filled header'() {

    const stringParams = [
      [ 'name1', 'value1' ],
      [ 'name2', 'value2' ],
      [ 'name3', 'value3' ]
    ];

    const newHttpParams = new HttpParams();
    let params = newHttpParams.append('name1', 'value1');
    params = params.append('name2', 'value2');
    params = params.append('name3', 'value3');

    const recordsParams = {
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    };

    const httpStringParams = new HttpParams(stringParams);
    const httpHttpParams = new HttpParams(params);
    const httpRecordsParams = new HttpParams(recordsParams);

    httpStringParams.toObject().should.be.eql({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

    httpHttpParams.toObject().should.be.eql({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

    httpRecordsParams.toObject().should.be.eql({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

  }

  @test 'should append data to the same entry'() {

    let params = this.params.set('name', 'value1');
    params = params.append('name2', 'value1');
    params = params.append('name', 'value2');
    params = params.set('name1', undefined);
    params = params.append('name1', undefined);

    params.toObject().should.be.eql({
      name: 'value1,value2',
      name2: 'value1'
    });
  }

}
