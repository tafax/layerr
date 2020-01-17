import { TestQueryResult } from '../query-result/test.query-result';
import { TestQuery } from '../query/test.query';

export class TestQueryHandler {

  handle(query: TestQuery): TestQueryResult {
    return new TestQueryResult('result!');
  }

}
