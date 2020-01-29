
import { throwError } from 'rxjs';
import { CustomError } from '../custom.error';

export class EvilCommandStringHandlerForTest {
  handle(command: string) {
    command.should.be.eql('EvilCommandForTest');
    return throwError(new CustomError());
  }
}
