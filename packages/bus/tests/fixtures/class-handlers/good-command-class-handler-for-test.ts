
import { of } from 'rxjs';
import { GoodCommandForTest } from '../good-command-for-test';

export class GoodCommandClassHandlerForTest {

  handle(command: GoodCommandForTest) {
    command.checkProperty.should.be.eql('alright!');
    return of(undefined);
  }

  applyCommand(command: GoodCommandForTest) {
    command.checkProperty.should.be.eql('alright!');
    return of(undefined);
  }

}
