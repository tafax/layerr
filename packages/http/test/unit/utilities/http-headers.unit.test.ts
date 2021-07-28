import { suite, test } from '@testdeck/jest';
import { HttpHeaders } from '../../../src/lib/utilities/http-headers';

@suite
class HttpHeadersUnitTest {

  private SUT: HttpHeaders;

  before() {
    this.SUT = new HttpHeaders();
  }

  @test
  givenNameAndValue_whenAppend_thenAddValue() {
    const headers = this.SUT.append('name', 'value');
    expect(headers.get('name')).toStrictEqual('value');
    expect(this.SUT.get('name')).toBeNull();
  }

  @test
  whenClone_thenReturnCloned() {
    const cloned = this.SUT.clone();
    expect(cloned.get('name')).toBeNull();
    expect(this.SUT.get('name')).toBeNull();
  }

  @test
  givenNameAndValue_whenClone_thenReturnCloned() {
    const cloned = this.SUT.clone({ name: 'name', value: 'value', op: 'w' });
    expect(cloned.get('name')).toStrictEqual('value');
    expect(this.SUT.get('name')).toBeNull();
  }

  @test
  givenNameAndValue_whenSet_thenSetValue() {
    const headers = this.SUT.set('name', 'value');
    expect(headers.get('name')).toStrictEqual('value');
    expect(this.SUT.get('name')).toBeNull();
  }

  @test
  givenName_whenHas_thenReturnTrue() {
    const headers = this.SUT.set('name', 'value');
    expect(headers.has('name')).toBeTruthy();
  }

  @test
  givenName_whenDelete_thenRemoveEntry() {
    const headers = this.SUT.set('name', 'value');
    expect(headers.has('name')).toBeTruthy();

    const deleted = headers.delete('name');
    expect(deleted.has('name')).toBeFalsy();
  }

  @test
  givenFunction_whenForEach_thenExecuteIt() {
    const headers = this.SUT.set('name', 'value');
    headers.forEach(
      (value, name) => {
        expect(value).toStrictEqual('value');
        expect(name).toStrictEqual('name');
      },
      this,
    );
  }

  @test
  whenToObject_thenReturnJsonObject() {
    let headers = this.SUT.append('name1', 'value1');
    headers = headers.append('name2', 'value2');
    headers = headers.append('name3', 'value3');
    expect(headers.toObject()).toStrictEqual({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });
  }

  @test
  givenHeaders_whenConstruct_thenCreateIt() {
    const stringHeaders = [
      [ 'name1', 'value1' ],
      [ 'name2', 'value2' ],
      [ 'name3', 'value3' ],
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

    expect(httpStringHeaders.toObject()).toStrictEqual({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

    expect(httpHttpHeaders.toObject()).toStrictEqual({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

    expect(httpRecordsHeaders.toObject()).toStrictEqual({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });
  }
}
