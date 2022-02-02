import { suite, test } from '@testdeck/jest';
import { SelectorFixture } from './fixture/selector.fixture';
import { StoreFixture } from './fixture/store.fixture';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

@suite
class ReactiveSelectorIntegrationTest {

  private SUT: SelectorFixture;
  private store: StoreFixture;

  before() {
    this.store = new StoreFixture();
    this.SUT = new SelectorFixture(this.store);
  }

  @test
  givenNewValue_whenUpdateTheStore_thenTheSelectorShouldEmitIt() {
    const observable1 = subscribeSpyTo(this.SUT.getValue1$());
    const observable2 = subscribeSpyTo(this.SUT.getValue2$());

    this.store.updateValue1('value');

    expect(observable1.getValueAt(0)).toBe('init');
    expect(observable1.getLastValue()).toBe('value');

    expect(observable2.getValueAt(0)).toBe('init');
    expect(observable2.getLastValue()).toBe('init');
  }

  @test
  givenNewValue_whenUpdateTheStoreInTransaction_thenTheSelectorShouldEmitIt() {
    const observable1 = subscribeSpyTo(this.SUT.getValue1$());
    const observable2 = subscribeSpyTo(this.SUT.getValue2$());

    this.store.startTransaction();

    this.store.updateValue1('value11');
    this.store.updateValue2('value21');
    this.store.updateValue1('value12');

    this.store.commitTransaction();

    expect(observable1.getValuesLength()).toBe(2);
    expect(observable1.getLastValue()).toBe('value12');

    expect(observable2.getValuesLength()).toBe(2);
    expect(observable2.getLastValue()).toBe('value21');
  }
}
