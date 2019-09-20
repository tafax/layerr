
import { suite, test, should } from '@layerr/test';
import { IndexItemsCollection } from '../../src/collections/index-items.collection';

interface StringItemToCollect {
  index: string;
}

interface AnyItemToCollect {
  index: any;
}

//@ts-ignore
@suite class IndexItemsCollectionUnitTests {

  private stringIndexItemsCollection: IndexItemsCollection<StringItemToCollect, 'index'>;
  private anyIndexItemsCollection: IndexItemsCollection<AnyItemToCollect, 'index'>;
  private emptyItemsCollection: IndexItemsCollection<AnyItemToCollect, 'index'>;

  private stringIndexInitialItems: StringItemToCollect[];
  private anyIndexInitialItems: AnyItemToCollect[];

  before() {

    this.stringIndexInitialItems = [
      {
        index: '0'
      },
      {
        index: '1'
      },
      {
        index: '2'
      }
    ];

    this.anyIndexInitialItems = [
      {
        index: 0
      },
      {
        index: 1
      },
      {
        index: 2
      }
    ];

    this.stringIndexItemsCollection = new IndexItemsCollection('index', this.stringIndexInitialItems);
    this.anyIndexItemsCollection = new IndexItemsCollection('index', this.anyIndexInitialItems);
    this.emptyItemsCollection = new IndexItemsCollection<AnyItemToCollect, 'index'>('index');
  }

  @test 'should add an item to the collection'() {

    const stringItem = { index: '3' };
    this.stringIndexItemsCollection.add(stringItem);
    should.equal(this.stringIndexItemsCollection.get('3'), stringItem);

    const anyItem = { index: 3 };
    this.anyIndexItemsCollection.add(anyItem);
    should.equal(this.anyIndexItemsCollection.get(3), anyItem);

    this.emptyItemsCollection.add(anyItem);
    should.equal(this.anyIndexItemsCollection.get(3), anyItem);
  }

  @test 'should remove an item from the collection'() {

    this.stringIndexItemsCollection.has('0').should.be.true;
    this.stringIndexItemsCollection.remove('0');
    this.stringIndexItemsCollection.has('0').should.be.false;
    should.equal(this.stringIndexItemsCollection.remove('not-present'), undefined);

    this.anyIndexItemsCollection.has(0).should.be.true;
    this.anyIndexItemsCollection.remove(0);
    this.anyIndexItemsCollection.has(0).should.be.false;
    should.equal(this.anyIndexItemsCollection.remove('not-present'), undefined);

    this.emptyItemsCollection.has(0).should.be.false;
    this.emptyItemsCollection.remove(0);
    this.emptyItemsCollection.has(0).should.be.false;
    should.equal(this.emptyItemsCollection.remove('not-present'), undefined);
  }

  @test 'should return all items of the collection'() {

    this.stringIndexItemsCollection.getAll().should.have.members(this.stringIndexInitialItems);
    this.anyIndexItemsCollection.getAll().should.have.members(this.anyIndexInitialItems);
    this.emptyItemsCollection.getAll().should.be.empty;
  }

  @test 'should clear the collection'() {

    this.stringIndexItemsCollection.getAll().length.should.be.greaterThan(0);
    this.stringIndexItemsCollection.clear();
    this.stringIndexItemsCollection.getAll().should.be.empty;

    this.anyIndexItemsCollection.getAll().length.should.be.greaterThan(0);
    this.anyIndexItemsCollection.clear();
    this.anyIndexItemsCollection.getAll().should.be.empty;

    this.emptyItemsCollection.getAll().should.be.empty;
    this.emptyItemsCollection.clear();
    this.emptyItemsCollection.getAll().should.be.empty;
  }

}
