
import { of } from 'rxjs';
import { GoodQueryForTest } from './good-query-for-test';

export class GoodQueryHandlerForTest {
  handle(query: GoodQueryForTest) {
    query.checkProperty.should.be.eql('alright!');
    return of('result-value');
  }
}
