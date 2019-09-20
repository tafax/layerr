
import { throwError } from 'rxjs';
import { EviCommandForTest } from './evi-command-for-test';
import { CustomError } from './custom.error';

export class EvilCommandHandlerForTest {
  handle(command: EviCommandForTest) {
    command.checkProperty.should.be.eql('alright!');
    return throwError(new CustomError());
  }
}
