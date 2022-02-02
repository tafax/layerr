import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { ReactiveStore } from "./reactive.store";

/**
 * This represents the base selector to use in combination with the reactive store
 */
export abstract class ReactiveSelector<TState, UReactiveStore extends ReactiveStore<TState>> {

  constructor(private readonly _store: UReactiveStore) {}

  /**
   * Gets the state observable from the store
   */
  protected getState$(): Observable<TState> {
    return this._store.getState$()
    .pipe(
      // The state can't be undefined or null. It can just contain undefined or null values
      filter(state => state !== undefined && state !== null),
    );
  }
}
