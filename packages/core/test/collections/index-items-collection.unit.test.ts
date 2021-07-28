import { expect } from '@jest/globals';
import { suite, test } from '@testdeck/jest';
import { IndexItemsCollection } from '../../src/lib/collections/index-items.collection';

interface StringItemToCollect {
  index: string;
}

interface AnyItemToCollect {
  index: unknown;
}

@suite class IndexItemsCollectionUnitTest {

  private stringIndexItemsCollection: IndexItemsCollection<StringItemToCollect, 'index'>;
  private anyIndexItemsCollection: IndexItemsCollection<AnyItemToCollect, 'index'>;
  private emptyItemsCollection: IndexItemsCollection<AnyItemToCollect, 'index'>;

  private stringIndexInitialItems: StringItemToCollect[];
  private anyIndexInitialItems: AnyItemToCollect[];

  before() {

    this.stringIndexInitialItems = [
      {
        index: '0',
      },
      {
        index: '1',
      },
      {
        index: '2',
      },
    ];

    this.anyIndexInitialItems = [
      {
        index: 0,
      },
      {
        index: 1,
      },
      {
        index: 2,
      },
    ];

    this.stringIndexItemsCollection = new IndexItemsCollection('index', this.stringIndexInitialItems);
    this.anyIndexItemsCollection = new IndexItemsCollection('index', this.anyIndexInitialItems);
    this.emptyItemsCollection = new IndexItemsCollection<AnyItemToCollect, 'index'>('index');
  }

  @test givenItem_whenAdd_thenAddIt() {
    const stringItem = { index: '3' };
    this.stringIndexItemsCollection.add(stringItem);
    expect(this.stringIndexItemsCollection.get('3')).toStrictEqual(stringItem);

    const anyItem = { index: 3 };
    this.anyIndexItemsCollection.add(anyItem);
    expect(this.anyIndexItemsCollection.get(3)).toStrictEqual(anyItem);

    this.emptyItemsCollection.add(anyItem);
    expect(this.emptyItemsCollection.get(3)).toStrictEqual(anyItem);
  }

  @test givenItem_whenRemove_thenRemoveIt() {
    expect(this.stringIndexItemsCollection.has('0')).toBeTruthy();
    this.stringIndexItemsCollection.remove('0');
    expect(this.stringIndexItemsCollection.has('0')).toBeFalsy();
    expect(this.stringIndexItemsCollection.remove('not-present')).toBeUndefined();

    expect(this.anyIndexItemsCollection.has(0)).toBeTruthy();
    this.anyIndexItemsCollection.remove(0);
    expect(this.anyIndexItemsCollection.has(0)).toBeFalsy();
    expect(this.anyIndexItemsCollection.remove('not-present')).toBeUndefined();

    expect(this.emptyItemsCollection.has(0)).toBeFalsy();
    this.emptyItemsCollection.remove(0);
    expect(this.emptyItemsCollection.has(0)).toBeFalsy();
    expect(this.emptyItemsCollection.remove('not-present')).toBeUndefined();
  }

  @test whenGetAll_thenReturnAllItems() {
    expect(this.stringIndexItemsCollection.getAll()).toStrictEqual(this.stringIndexInitialItems);
    expect(this.anyIndexItemsCollection.getAll()).toStrictEqual(this.anyIndexInitialItems);
    expect(this.emptyItemsCollection.getAll()).toHaveLength(0);
  }

  @test whenClear_thenClearCollection() {
    expect(this.stringIndexItemsCollection.getAll().length).toBeGreaterThan(0);
    this.stringIndexItemsCollection.clear();
    expect(this.stringIndexItemsCollection.getAll()).toHaveLength(0);

    expect(this.anyIndexItemsCollection.getAll().length).toBeGreaterThan(0);
    this.anyIndexItemsCollection.clear();
    expect(this.anyIndexItemsCollection.getAll()).toHaveLength(0);

    expect(this.emptyItemsCollection.getAll()).toHaveLength(0);
    this.emptyItemsCollection.clear();
    expect(this.emptyItemsCollection.getAll()).toHaveLength(0);
  }
}
