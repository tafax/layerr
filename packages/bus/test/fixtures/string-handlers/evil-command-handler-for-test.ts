import { throwError, Observable } from 'rxjs';
import { CustomError } from '../custom.error';

export class EvilCommandStringHandlerForTest {
  handle(command: string): Observable<unknown> {
    expect(command).toStrictEqual('EvilCommandForTest');
    return throwError(new CustomError());
  }
}
