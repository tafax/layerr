

import { suite, test, should } from '@layerr/test';
import { HttpHeaders } from '../../../src/utilities/http-headers';

@suite class HttpHeadersUnitTests {

  private headers: HttpHeaders;

  before() {
    this.headers = new HttpHeaders();
  }

  @test 'should clone'() {
    const headers = this.headers.append('name', 'value');
    headers.get('name').should.be.eql('value');

    const cloned = headers.clone();
    cloned.get('name').should.be.eql('value');
  }

  @test 'should append a new value'() {
    const headers = this.headers.append('name', 'value');
    headers.get('name').should.be.eql('value');
    should.not.exist(this.headers.get('name'));
  }

  @test 'should set a new value'() {
    const headers = this.headers.set('name', 'value');
    headers.get('name').should.be.eql('value');
    should.not.exist(this.headers.get('name'));
  }

  @test 'should has a value'() {
    const headers = this.headers.set('name', 'value');
    headers.has('name').should.be.true;
    this.headers.has('name').should.be.false;
  }

  @test 'should delete a value'() {
    let headers = this.headers.set('name', 'value');
    headers = headers.set('name1', 'value');
    headers.has('name').should.be.true;
    headers.has('name1').should.be.true;
    this.headers.has('name').should.be.false;

    let headers2 = headers.delete('name');
    headers2 = headers2.delete('name2');
    headers2.has('name').should.be.false;
    headers2.has('name1').should.be.true;
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
    let headers = this.headers.append('name1', 'value1');
    headers = headers.append('name2', 'value2');
    headers = headers.append('name3', 'value3');
    headers.toObject().should.be.eql({
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
    let headers = newHttpHeaders.append('name1', 'value1');
    headers = headers.append('name2', 'value2');
    headers = headers.append('name3', 'value3');

    const recordsHeaders = {
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    };

    const httpStringHeaders = new HttpHeaders(stringHeaders);
    const httpHttpHeaders = new HttpHeaders(headers);
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
