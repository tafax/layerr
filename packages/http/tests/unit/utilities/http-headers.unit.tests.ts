

import { suite, test, should } from '@layerr/test';
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

  @test 'should return null if the key is not defined'() {
    should.not.exist(this.headers.get('some'));
  }

  @test 'should convert the headers into a json object'() {
    this.headers.append('name1', 'value1');
    this.headers.append('name2', 'value2');
    this.headers.append('name3', 'value3');
    this.headers.toObject().should.be.eql({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });
  }

  @test 'should create a filled header'() {

    const stringHeaders = [
      [ 'name1', 'value1' ],
      [ 'name2', 'value2' ],
      [ 'name3', 'value3' ]
    ];

    const newHttpHeaders = new HttpHeaders();
    newHttpHeaders.append('name1', 'value1');
    newHttpHeaders.append('name2', 'value2');
    newHttpHeaders.append('name3', 'value3');

    const recordsHeaders = {
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    };

    const httpStringHeaders = new HttpHeaders(stringHeaders);
    const httpHttpHeaders = new HttpHeaders(newHttpHeaders);
    const httpRecordsHeaders = new HttpHeaders(recordsHeaders);

    httpStringHeaders.toObject().should.be.eql({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

    httpHttpHeaders.toObject().should.be.eql({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

    httpRecordsHeaders.toObject().should.be.eql({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

  }

}
