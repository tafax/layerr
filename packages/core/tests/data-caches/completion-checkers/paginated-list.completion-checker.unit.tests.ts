
import { suite, test } from '@layerr/test';
import { PaginatedListCompletionChecker } from '../../../src/data-caches/completion-checkers/paginated-list.completion-checker';

//@ts-ignore
@suite class PaginatedListCompletionCheckerUnitTests {

  private completionChecker: PaginatedListCompletionChecker;

  before() {
    this.completionChecker = new PaginatedListCompletionChecker();
  }

  @test 'should set the new state and set the reset to false'() {
    const prevState = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 1,
      totalPages: 2,
      itemsCount: 1
    };

    const newState = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 2,
      totalPages: 2,
      itemsCount: 2
    };

    this.completionChecker.needsReset(newState, prevState).should.be.false;
  }

  @test 'should set the new state and set the reset to true if the OrderBy changes'() {
    const prevState = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2,
      itemsCount: 1
    };

    const newState = {
      orderBy: 'orderBy2',
      loadedPagesCount: 1,
      totalPages: 2,
      itemsCount: 1
    };

    this.completionChecker.needsReset(newState, prevState).should.be.true;
  }

  @test 'should return true as isComplete if the state has all the pages'() {
    const state = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 1,
      totalPages: 1,
      itemsCount: 1
    };

    this.completionChecker.isComplete(state).should.be.true;
  }

  @test 'should return false as isComplete if the state doesn\'t have all the pages'() {
    const state = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 1,
      totalPages: 2,
      itemsCount: 1
    };

    this.completionChecker.isComplete(state).should.be.false;
  }

  @test 'should return false as isComplete if there is only 1 page and it\'s empty'() {
    const state = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 1,
      totalPages: 1,
      itemsCount: 0
    };

    this.completionChecker.isComplete(state).should.be.false;
  }

}
