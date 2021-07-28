import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { PaginatedListCompletionChecker } from '../../../src/lib/data-caches/completion-checkers/paginated-list.completion-checker';

@suite class PaginatedListCompletionCheckerUnitTest {

  private SUT: PaginatedListCompletionChecker;

  before() {
    this.SUT = new PaginatedListCompletionChecker();
  }

  @test givenEqualNewAndPrevState_whenNeedsReset_thenReturnFalse() {
    const prevState = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 1,
      totalPages: 2,
      itemsCount: 1,
    };

    const newState = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 2,
      totalPages: 2,
      itemsCount: 2,
    };

    expect(this.SUT.needsReset(newState, prevState)).toBeFalsy();
  }

  @test givenNewAndPrevStateWithDifferentOrderBy_whenNeedsReset_thenReturnTrue() {
    const prevState = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2,
      itemsCount: 1,
    };

    const newState = {
      orderBy: 'orderBy2',
      loadedPagesCount: 1,
      totalPages: 2,
      itemsCount: 1,
    };

    expect(this.SUT.needsReset(newState, prevState)).toBeTruthy();
  }

  @test givenStateWithAllPages_whenIsComplete_thenReturnTrue() {
    const state = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 1,
      totalPages: 1,
      itemsCount: 1,
    };

    expect(this.SUT.isComplete(state)).toBeTruthy();
  }

  @test givenState_whenIsComplete_thenReturnFalse() {
    const state = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 1,
      totalPages: 2,
      itemsCount: 1,
    };

    expect(this.SUT.isComplete(state)).toBeFalsy();
  }

  @test givenStateWithOneEmptyPage_whenIsComplete_thenReturnFalse() {
    const state = {
      orderBy: 'orderBy',
      search: 'search',
      loadedPagesCount: 1,
      totalPages: 1,
      itemsCount: 0,
    };

    expect(this.SUT.isComplete(state)).toBeFalsy();
  }
}
