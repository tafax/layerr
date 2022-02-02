import { suite, test } from '@testdeck/jest';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { ReactiveStore } from '../../../src/lib/reactive/reactive.store';

const defaultState = {
  value: 'init',
};

class TestStore extends ReactiveStore<typeof defaultState> {
  protected getInitialState(): typeof defaultState {
    return Object.assign({}, defaultState);
  }

  update(value: string): void {
    this.setState(state => {
      state.value = value;
      return state;
    });
  }
}

@suite
class ReactiveStoreUnitTest {

  private SUT: TestStore;

  before() {
    this.SUT = new TestStore();
  }

  @test
  whenGetInitialState_thenReturnTheDefaultState() {
    expect(this.SUT.initialState).toEqual(defaultState);
  }

  @test
  givenNewValue_thenReturnTheNewState() {
    this.SUT.update('newValue');

    const observable = subscribeSpyTo(this.SUT.getState$());
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.getLastValue()).toEqual({ value: 'newValue' });
  }

  @test
  whenStartTransaction_thenAllowToCommitIt() {
    this.SUT.startTransaction();
    this.SUT.update('newValue1');
    this.SUT.update('newValue2');
    this.SUT.commitTransaction();

    const observable = subscribeSpyTo(this.SUT.getState$());
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.getLastValue()).toEqual({ value: 'newValue2' });
  }

  @test
  whenStartTransaction_thenAllowToRollbackIt() {
    this.SUT.startTransaction();
    this.SUT.update('newValue1');
    this.SUT.update('newValue2');
    this.SUT.rollbackTransaction();

    const observable = subscribeSpyTo(this.SUT.getState$());
    expect(observable.receivedComplete()).toBeFalsy();
    expect(observable.getLastValue()).toEqual({ value: 'init' });
  }
}
