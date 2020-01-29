
import { of } from 'rxjs';

export class GoodCommandStringHandlerForTest {
  handle(command: string) {
    command.should.be.eql('GoodCommandForTest');
    return of(undefined);
  }
}
