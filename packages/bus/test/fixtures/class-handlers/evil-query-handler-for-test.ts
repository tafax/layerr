import { expect } from '@jest/globals';
import { throwError, Observable } from 'rxjs';
import { EvilQueryForTest } from '../evil-query-for-test';
import { CustomError } from '../custom.error';

export class EvilQueryHandlerForTest {
  handle(query: EvilQueryForTest): Observable<unknown> {
    expect(query.checkProperty).toStrictEqual('alright!');
    return throwError(new CustomError());
  }
}
