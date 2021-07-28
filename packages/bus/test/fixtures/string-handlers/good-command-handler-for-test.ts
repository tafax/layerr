import { of, Observable } from 'rxjs';

export class GoodCommandStringHandlerForTest {
  handle(command: string): Observable<unknown> {
    expect(command).toStrictEqual('GoodCommandForTest');
    return of(undefined);
  }
}
