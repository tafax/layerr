
import { throwError } from 'rxjs';
import { EvilCommandForTest } from '../evil-command-for-test';
import { CustomError } from '../custom.error';

export class EvilCommandClassHandlerForTest {

  handle(command: EvilCommandForTest) {
    command.checkProperty.should.be.eql('alright!');
    return throwError(new CustomError());
  }

  applyCommand(command: EvilCommandForTest) {
    command.checkProperty.should.be.eql('alright!');
    return throwError(new CustomError());
  }

}
