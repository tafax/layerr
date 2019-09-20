
import { suite, test, should } from '@layerr/test';
import { SimpleListCache, CacheableItem } from '../../../src/data-caches/simple-caches/simple-list.cache';

//@ts-ignore
@suite class SimpleListCacheUnitTests {

  private simpleListCache: SimpleListCache<any>;

  before() {
    this.simpleListCache = new SimpleListCache();
  }

  @test 'should store a set of items'() {

    this.simpleListCache.pushItems([
      <CacheableItem><any>{ id: 'item1' },
      <CacheableItem><any>{ id: 'item2' },
      <CacheableItem><any>{ id: 'item3' },
      <CacheableItem><any>{ noID: 'item4' },
    ]);
    this.simpleListCache.getItems().should.be.not.empty;
    this.simpleListCache.hasItems().should.be.true;
  }

  @test 'should store a single item'() {

    const item = <CacheableItem><any>{ id: 'item1' };
    this.simpleListCache.pushItem(item);
    this.simpleListCache.getItem('item1').should.be.equal(item);
  }

  @test 'should return true if it handles a specific item given its key'() {

    const item = <CacheableItem><any>{ id: 'item1' };
    this.simpleListCache.pushItem(item);
    this.simpleListCache.hasKey('item1').should.be.true;
  }

  @test 'should return false if it doesn\'t handle a specific item given its key'() {

    this.simpleListCache.hasKey('item1').should.be.false;
  }

  @test 'should return undefined if it doesn\'t handle a specific item given its key'() {

    should.equal(this.simpleListCache.getItem('item1'), undefined);
  }

  @test 'should NOT insert an item twice for the same key'() {

    const item = <CacheableItem><any>{ id: 'item1' };

    this.simpleListCache.pushItem(item);
    this.simpleListCache.pushItem(item);

    this.simpleListCache.getItem('item1').should.be.equal(item);

    this.simpleListCache.getItems().should.have.length(1);
    this.simpleListCache.getItems().should.have.members([ item ]);
  }

  @test 'should return the whole set'() {

    const set = [
      <CacheableItem><any>{ id: 'item1' },
      <CacheableItem><any>{ id: 'item2' },
      <CacheableItem><any>{ id: 'item3' },
    ];

    this.simpleListCache.pushItems(set);
    this.simpleListCache.getItems().should.have.members(set);
  }

  @test 'should clear the set'() {

    const set = [
      <CacheableItem><any>{ id: 'item1' },
      <CacheableItem><any>{ id: 'item2' },
      <CacheableItem><any>{ id: 'item3' },
    ];

    this.simpleListCache.pushItems(set);
    this.simpleListCache.getItems().should.have.members(set);

    this.simpleListCache.clear();
    this.simpleListCache.getItems().should.be.empty;
  }

  @test 'should remove an item'() {

    const set = [
      <CacheableItem><any>{ id: 'item1' },
      <CacheableItem><any>{ id: 'item2' },
      <CacheableItem><any>{ id: 'item3' },
    ];

    this.simpleListCache.pushItems(set);
    this.simpleListCache.deleteItem('item1');
    this.simpleListCache.hasKey('item2').should.be.true;
    this.simpleListCache.hasKey('item3').should.be.true;
  }

}
