import { suite, test, params } from '@testdeck/jest';
import { ReactiveSelector } from '../../../src/lib/reactive/reactive.selector';
import { ReactiveStore } from '../../../src/lib/reactive/reactive.store';
import { mock, instance, when } from 'ts-mockito';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

const defaultState = {
  value: 'init',
};

class TestStore extends ReactiveStore<typeof defaultState> {
  protected getInitialState(): typeof defaultState {
    return Object.assign({}, defaultState);
  }
}

class TestSelector extends ReactiveSelector<typeof defaultState, TestStore> {
  getValue$(): Observable<string> {
    return this.getState$()
      .pipe(
        map(state => state.value),
      );
  }
}

@suite
class ReactiveSelectorUnitTest {

  private SUT: TestSelector;
  private store: TestStore;

  before() {
    this.store = mock(TestStore);
    this.SUT = new TestSelector(instance(this.store));
  }

  @test
  whenGetValue_thenReturnState() {
    when(this.store.getState$()).thenReturn(of(defaultState));

    const observable = subscribeSpyTo(this.SUT.getValue$());
    expect(observable.receivedNext()).toBeTruthy();
    expect(observable.getLastValue()).toEqual('init');
  }

  @test
  @params(undefined)
  @params(null)
  whenGetValue_thenDoNotReturnItIfTheStateIsNotValid(state) {
    when(this.store.getState$()).thenReturn(of(state));

    const observable = subscribeSpyTo(this.SUT.getValue$());
    expect(observable.receivedNext()).toBeFalsy();
  }
}