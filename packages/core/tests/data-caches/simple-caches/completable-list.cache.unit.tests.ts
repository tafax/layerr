
import { suite, test, IMock, Mock, It, should } from '@layerr/test';
import { CompletionCheckerInterface } from '../../../src/data-caches/completion-checkers/completion-checker.interface';
import { PaginatedListCompletionChecker } from '../../../src/data-caches/completion-checkers/paginated-list.completion-checker';
import { CompletableListCache } from '../../../src/data-caches/simple-caches/completable-list.cache';
import { CacheableItem } from '../../../src/data-caches/simple-caches/simple-list.cache';

//@ts-ignore
@suite class CompletableListCacheUnitTests {

  private completableListCache: CompletableListCache<any, any>;
  private completionCheckerMock: IMock<CompletionCheckerInterface<any>>;

  before() {
    this.completionCheckerMock = Mock.ofType<CompletionCheckerInterface<any>>(PaginatedListCompletionChecker);

    this.completableListCache = new CompletableListCache(this.completionCheckerMock.object);
  }

  @test 'should return the completion checker'() {

    should.equal(this.completableListCache.completionChecker, this.completionCheckerMock.object);
  }

  @test 'should return the current state as undefined at first time'() {
    should.equal(this.completableListCache.getState(), undefined);
  }

  @test 'should return the current set state'() {
    const state = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2
    };
    this.completableListCache.setState(state);
    this.completableListCache.getState().should.be.equal(state);
  }

  @test 'should push the items to the cache and update the state without reset the cache'() {

    this.completionCheckerMock
      .setup((checker: CompletionCheckerInterface<any>) => checker.needsReset(It.isAny(), It.isAny()))
      .returns(() => false);

    const state1 = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2
    };

    const state2 = {
      orderBy: 'orderBy',
      loadedPagesCount: 2,
      totalPages: 2
    };

    const itemSet1 = [
      <CacheableItem><any>{ id: 'item1' },
      <CacheableItem><any>{ id: 'item2' },
    ];

    const itemSet2 = [
      <CacheableItem><any>{ id: 'item3' },
      <CacheableItem><any>{ id: 'item4' },
    ];

    this.completableListCache.pushItems(itemSet1, state1);
    this.completableListCache.pushItems(itemSet2, state2);

    this.completableListCache.getItems().should.have.members([ ...itemSet1, ...itemSet2 ]);
    this.completableListCache.getState().should.be.equal(state2);
  }

  @test 'should push the items to the cache and update the state resetting the cache'() {

    this.completionCheckerMock
      .setup((checker: CompletionCheckerInterface<any>) => checker.needsReset(It.isAny(), It.isAny()))
      .returns(() => false);

    const state1 = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2
    };

    const itemSet1 = [
      <CacheableItem><any>{ id: 'item1' },
      <CacheableItem><any>{ id: 'item2' },
    ];
    
    this.completableListCache.pushItems(itemSet1, state1);

    this.completionCheckerMock
      .setup((checker: CompletionCheckerInterface<any>) => checker.needsReset(It.isAny(), It.isAny()))
      .returns(() => true);

    const state2 = {
      orderBy: 'orderBy2',
      loadedPagesCount: 1,
      totalPages: 2
    };

    const itemSet2 = [
      <CacheableItem><any>{ id: 'item3' },
      <CacheableItem><any>{ id: 'item4' },
    ];
    
    this.completableListCache.pushItems(itemSet2, state2);

    this.completableListCache.getItems().should.have.members(itemSet2);
    this.completableListCache.getState().should.be.equal(state2);
  }

  @test 'should tell the cache is complete if the completion checker return true'() {

    this.completionCheckerMock
      .setup((checker: CompletionCheckerInterface<any>) => checker.isComplete(It.isAny()))
      .returns(() => true);

    this.completableListCache.isCacheComplete().should.be.true;
  }

  @test 'should tell the cache is NOT complete if the completion checker return false'() {

    this.completionCheckerMock
      .setup((checker: CompletionCheckerInterface<any>) => checker.isComplete(It.isAny()))
      .returns(() => false);

    this.completableListCache.isCacheComplete().should.be.false;
  }

  @test 'should reset the cache'() {
    const state = {
      orderBy: 'orderBy',
      loadedPagesCount: 1,
      totalPages: 2
    };

    const itemSet1 = [
      <CacheableItem><any>{ id: 'item1' },
      <CacheableItem><any>{ id: 'item2' },
    ];
    
    this.completableListCache.pushItems(itemSet1, state);

    this.completableListCache.getItems().should.have.members(itemSet1);
    this.completableListCache.getState().should.be.equal(state);

    this.completableListCache.clear();

    this.completableListCache.getItems().should.be.empty;
    should.equal(this.completableListCache.getState(), undefined);
  }
}
