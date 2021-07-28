import { expect } from '@jest/globals';
import { of, Observable } from 'rxjs';
import { GoodQueryForTest } from '../good-query-for-test';

export class GoodQueryHandlerForTest {
  handle(query: GoodQueryForTest): Observable<unknown> {
    expect(query.checkProperty).toStrictEqual('alright!');
    return of('result-value');
  }
}
