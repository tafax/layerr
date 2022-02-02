import { ReactiveStore } from '../../../../src/lib/reactive/reactive.store';
import { StateFixture } from './state.fixture';

export class StoreFixture extends ReactiveStore<StateFixture> {
  updateValue1(value: string): void {
    this.setState(state => Object.assign({}, state, { value1: value }));
  }

  updateValue2(value: string): void {
    this.setState(state => Object.assign({}, state, { value2: value }));
  }

  protected getInitialState(): StateFixture {
    return {
      value1: 'init',
      value2: 'init',
    };
  }
}
