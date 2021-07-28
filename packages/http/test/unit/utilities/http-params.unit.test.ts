import { suite, test } from '@testdeck/jest';
import { HttpParams } from '../../../src/lib/utilities/http-params';

@suite
class HttpParamsUnitTest {

  private SUT: HttpParams;

  before() {
    this.SUT = new HttpParams();
  }

  @test
  whenClone_thenReturnCloned() {
    const params = this.SUT.clone();
    expect(params).not.toBe(this.SUT);
  }

  @test
  givenNameAndValue_whenAppend_thenAddIt() {
    const params = this.SUT.append('name', 'value');
    expect(params.get('name')).toStrictEqual('value');
    expect(this.SUT.get('name')).toBeNull();
  }

  @test
  givenNameAndValue_whenSet_thenSetIt() {
    const params = this.SUT.set('name', 'value');
    expect(params.get('name')).toStrictEqual('value');
    expect(this.SUT.get('name')).toBeNull();
  }

  @test
  givenName_whenHas_thenReturnTrue() {
    const params = this.SUT.set('name', 'value');
    expect(params.has('name')).toBeTruthy();
  }

  @test
  givenName_whenHas_thenReturnFalse() {
    expect(this.SUT.has('name')).toBeFalsy();
  }

  @test
  givenName_whenDelete_thenDeleteIt() {
    const params = this.SUT.set('name', 'value');
    const deleted = params.delete('name');
    expect(deleted.has('name')).toBeFalsy();
  }

  @test
  givenFunction_whenForEach_thenExecuteIt() {
    const params = this.SUT.set('name', 'value');
    params.forEach(
      (value, name) => {
        expect(name).toStrictEqual('name');
        expect(value).toStrictEqual('value');
      },
      this,
    );
  }

  @test
  givenName_whenGetAll_thenReturnAllValues() {
    const params = this.SUT.set('name', 'value');
    expect(params.getAll('name')).toStrictEqual([ 'value' ]);
  }

  @test
  givenNotExistingName_whenGetAll_thenReturnEmpty() {
    expect(this.SUT.getAll('name')).toStrictEqual([]);
  }

  @test
  givenNotExistingName_whenGet_thenReturnNull() {
    expect(this.SUT.get('some')).toBeNull();
  }

  @test
  whenIsEmpty_thenReturnTrue() {
    expect(this.SUT.isEmpty()).toBeTruthy();
  }

  @test
  whenIsEmpty_thenReturnFalse() {
    const params = this.SUT.set('name', 'value');
    expect(params.isEmpty()).toBeFalsy();
  }

  @test
  whenToString_thenReturnQuery() {
    let params = this.SUT.set('name', 'value');
    params = params.set('name?-', 'value value');

    const query = params.toString();
    expect(query).toStrictEqual('name=value&name%3F-=value%20value');
  }

  @test
  whenToObject_thenReturnJsonObject() {
    let params = this.SUT.append('name1', 'value1');
    params = params.append('name2', 'value2');
    params = params.append('name3', 'value3');
    expect(params.toObject()).toStrictEqual({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });
  }

  @test
  givenParams_whenConstruct_thenCreateIt() {
    const stringParams = [
      [ 'name1', 'value1' ],
      [ 'name2', 'value2' ],
      [ 'name3', 'value3' ],
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

    expect(httpStringParams.toObject()).toStrictEqual({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

    expect(httpHttpParams.toObject()).toStrictEqual({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

    expect(httpRecordsParams.toObject()).toStrictEqual({
      name1: 'value1',
      name2: 'value2',
      name3: 'value3',
    });

  }

  @test
  givenNameAndValue_whenAppend_thenAppendIt() {
    let params = this.SUT.set('name', 'value1');
    params = params.append('name2', 'value1');
    params = params.append('name', 'value2');
    params = params.set('name1', undefined);
    params = params.append('name1', undefined);

    expect(params.toObject()).toStrictEqual({
      name: 'value1,value2',
      name2: 'value1',
    });
  }

}
