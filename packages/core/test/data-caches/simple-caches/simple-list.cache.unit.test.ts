import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { SimpleListCache, CacheableItem } from '../../../src/lib/data-caches/simple-caches/simple-list.cache';

@suite class SimpleListCacheUnitTest {

  private SUT: SimpleListCache<CacheableItem>;

  before() {
    this.SUT = new SimpleListCache();
  }

  @test givenItems_whenPushItems_thenAddThem() {
    this.SUT.pushItems([
      { id: 'item1' },
      { id: 'item2' },
      { id: 'item3' },
      { noID: 'item4' },
    ] as CacheableItem[]);

    expect(this.SUT.getItems().length).toBeGreaterThan(0);
    expect(this.SUT.hasItems()).toBeTruthy();
  }

  @test givenItem_whenPushItem_thenAddIt() {
    const item = { id: 'item1' } as CacheableItem;
    this.SUT.pushItem(item);
    expect(this.SUT.getItem('item1')).toStrictEqual(item);
  }

  @test givenItemKey_whenHasKey_thenReturnTrue() {
    const item = { id: 'item1' } as CacheableItem;
    this.SUT.pushItem(item);
    expect(this.SUT.hasKey('item1')).toBeTruthy();
  }

  @test givenItemKey_whenHasKey_thenReturnFalse() {
    expect(this.SUT.hasKey('item1')).toBeFalsy();
  }

  @test givenItemKey_whenGetItem_thenReturnUndefined() {
    expect(this.SUT.getItem('item1')).toBeUndefined();
  }

  @test givenItemTwice_whenPushItem_thenInsertItOnce() {
    const item = { id: 'item1' } as CacheableItem;

    this.SUT.pushItem(item);
    this.SUT.pushItem(item);

    expect(this.SUT.getItems()).toHaveLength(1);
    expect(this.SUT.getItems()).toStrictEqual([ item ]);
  }

  @test whenClear_thenClearCache() {
    const set = [
      { id: 'item1' },
      { id: 'item2' },
      { id: 'item3' },
    ] as CacheableItem[];

    this.SUT.pushItems(set);
    expect(this.SUT.getItems()).toStrictEqual(set);

    this.SUT.clear();
    expect(this.SUT.getItems()).toHaveLength(0);
  }

  @test 'should remove an item'() {
    const set = [
      { id: 'item1' },
      { id: 'item2' },
      { id: 'item3' },
    ] as CacheableItem[];

    this.SUT.pushItems(set);
    this.SUT.deleteItem('item1');
    expect(this.SUT.hasKey('item1')).toBeFalsy();
    expect(this.SUT.hasKey('item2')).toBeTruthy();
    expect(this.SUT.hasKey('item3')).toBeTruthy();
  }

}
