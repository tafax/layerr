import { ReactiveSelector } from '../../../../src/lib/reactive/reactive.selector';
import { StateFixture } from './state.fixture';
import { StoreFixture } from './store.fixture';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class SelectorFixture extends ReactiveSelector<StateFixture, StoreFixture> {

  getValue1$(): Observable<string> {
    return this.getState$()
      .pipe(
        map(state => state.value1),
      );
  }

  getValue2$(): Observable<string> {
    return this.getState$()
      .pipe(
        map(state => state.value2),
      );
  }
}