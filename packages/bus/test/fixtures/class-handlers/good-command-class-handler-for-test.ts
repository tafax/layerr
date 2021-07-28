import { of, Observable } from 'rxjs';
import { GoodCommandForTest } from '../good-command-for-test';

export class GoodCommandClassHandlerForTest {
  handle(command: GoodCommandForTest): Observable<unknown> {
    expect(command.checkProperty).toStrictEqual('alright!');
    return of(undefined);
  }

  applyCommand(command: GoodCommandForTest): Observable<unknown> {
    expect(command.checkProperty).toStrictEqual('alright!');
    return of(undefined);
  }
}
