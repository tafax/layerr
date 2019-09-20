
import { throwError } from 'rxjs';
import { EvilQueryForTest } from './evil-query-for-test';
import { CustomError } from './custom.error';

export class EvilQueryHandlerForTest {
  handle(query: EvilQueryForTest) {
    query.checkProperty.should.be.eql('alright!');
    return throwError(new CustomError());
  }
}
