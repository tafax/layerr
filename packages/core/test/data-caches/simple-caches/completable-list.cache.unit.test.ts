import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { mock, instance, when, anything, reset } from 'ts-mockito';
import { CompletionCheckerInterface } from '../../../src/lib/data-caches/completion-checkers/completion-checker.interface';
import { CompletableListCache } from '../../../src/lib/data-caches/simple-caches/completable-list.cache';
import { CacheableItem } from '../../../src/lib/data-caches/simple-caches/simple-list.cache';

@suite class CompletableListCacheUnitTest {

  private SUT: CompletableListCache<CacheableItem, unknown>;
  private completionChecker: CompletionCheckerInterface<unknown>;

  before() {
    this.completionChecker = mock<CompletionCheckerInterface<unknown>>();

    this.SUT = new CompletableListCache(
      instance(this.completionChecker),
    );
  }

  @test whenGetCompletionChecker_thenReturnIt() {
    expect(this.SUT.completionChecker).toBe(instance(this.completionChecker));
  }

  @test whenGetState_thenReturnUndefined() {
    expect(this.SUT.getState()).toBeUndefined();
  }

  @test givenState_whenSetState_thenSetIt() {
    const state = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2,
    };
    this.SUT.setState(state);
    expect(this.SUT.getState()).toBe(state);
  }

  @test givenStateAndItemSet_whenPushItems_thenUpdateStateWithoutResettingCache() {
    when(this.completionChecker.needsReset(anything(), anything())).thenReturn(false);

    const state1 = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2,
    };

    const state2 = {
      orderBy: 'orderBy',
      loadedPagesCount: 2,
      totalPages: 2,
    };

    const itemSet1 = [
      { id: 'item1' },
      { id: 'item2' },
    ] as CacheableItem[];

    const itemSet2 = [
      { id: 'item3' },
      { id: 'item4' },
    ] as CacheableItem[];

    this.SUT.pushItems(itemSet1, state1);
    this.SUT.pushItems(itemSet2, state2);

    expect(this.SUT.getItems()).toStrictEqual([ ...itemSet1, ...itemSet2 ]);
    expect(this.SUT.getState()).toBe(state2);
  }

  @test givenStateAndItemSet_whenPushItems_thenUpdateStateResettingCache() {
    when(this.completionChecker.needsReset(anything(), anything())).thenReturn(false);

    const state1 = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2,
    };

    const itemSet1 = [
      { id: 'item1' },
      { id: 'item2' },
    ] as CacheableItem[];

    this.SUT.pushItems(itemSet1, state1);

    reset(this.completionChecker);
    when(this.completionChecker.needsReset(anything(), anything())).thenReturn(true);

    const state2 = {
      orderBy: 'orderBy2',
      loadedPagesCount: 1,
      totalPages: 2,
    };

    const itemSet2 = [
      { id: 'item3' },
      { id: 'item4' },
    ] as CacheableItem[];

    this.SUT.pushItems(itemSet2, state2);

    expect(this.SUT.getItems()).toStrictEqual(itemSet2);
    expect(this.SUT.getState()).toBe(state2);
  }

  @test whenIsCacheComplete_thenReturnTrue() {
    when(this.completionChecker.isComplete(anything())).thenReturn(true);

    expect(this.SUT.isCacheComplete()).toBeTruthy();
  }

  @test whenIsCacheComplete_thenReturnFalse() {
    when(this.completionChecker.isComplete(anything())).thenReturn(false);

    expect(this.SUT.isCacheComplete()).toBeFalsy();
  }

  @test whenClear_thenClearCache() {
    const state = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2,
    };

    const itemSet1 = [
      { id: 'item1' },
      { id: 'item2' },
    ] as CacheableItem[];

    this.SUT.pushItems(itemSet1, state);
    this.SUT.clear();

    expect(this.SUT.getItems()).toHaveLength(0);
    expect(this.SUT.getState()).toBeUndefined();
  }
}
