
import { throwError } from 'rxjs';
import { EvilCommandForTest } from './evil-command-for-test';
import { CustomError } from './custom.error';

export class EvilCommandHandlerForTest {
  handle(command: EvilCommandForTest) {
    command.checkProperty.should.be.eql('alright!');
    return throwError(new CustomError());
  }
}
