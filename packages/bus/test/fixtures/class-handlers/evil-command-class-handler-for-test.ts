import { throwError, Observable } from 'rxjs';
import { EvilCommandForTest } from '../evil-command-for-test';
import { CustomError } from '../custom.error';

export class EvilCommandClassHandlerForTest {
  handle(command: EvilCommandForTest): Observable<unknown> {
    expect(command.checkProperty).toStrictEqual('alright!');
    return throwError(new CustomError());
  }

  applyCommand(command: EvilCommandForTest): Observable<unknown> {
    expect(command.checkProperty).toStrictEqual('alright!');
    return throwError(new CustomError());
  }
}
