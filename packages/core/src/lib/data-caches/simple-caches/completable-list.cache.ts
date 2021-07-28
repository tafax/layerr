import { SimpleListCache, CacheableItem } from './simple-list.cache';
import { CompletionCheckerInterface } from '../completion-checkers/completion-checker.interface';

/**
 * Defines a class to implement a cache that can be considered complete.
 *
 * Features:
 *   - We can clear the cache by removing all the cached items
 *   - We can get all the cached items
 *   - We can add more items to the cache
 *   - We must implement a method that tells whether the cache is complete.
 *
 * T: It is the type of the data we want to store with this cache.
 * U: It is the type of the state object used by the completion checker to tell when the cache is complete.
 */
export class CompletableListCache<T extends CacheableItem, U> extends SimpleListCache<T> {

  /**
   * The current state of the cache.
   */
  private _currentState: U;

  /**
   * @param _completionChecker The function used to check if the cache is complete.
   */
  constructor(
    private readonly _completionChecker: CompletionCheckerInterface<U>,
  ) {
    super();
  }

  /**
   * Gets the current state for the checker.
   */
  getState(): U {
    return this._currentState;
  }

  /**
   * Sets a new state for the completion checker.
   * It will be used to check if the cache can be consider complete or not.
   */
  setState(state: U): void {
    this._currentState = state;
  }

  /**
   * Returns the current completion checker.
   */
  get completionChecker(): CompletionCheckerInterface<U> {
    return this._completionChecker;
  }

  /**
   * Pushes new item set into the cache and eventually updates the state of the cache.
   */
  pushItems(items: T[], state?: U): void {
    if (this._completionChecker.needsReset(state, this._currentState)) {
      this.clear();
    }
    this.setState(state);
    super.pushItems(items);
  }

  /**
   * Tells whether the cache is complete or not.
   */
  isCacheComplete(): boolean {
    return this._completionChecker.isComplete(this.getState());
  }

  /**
   * Resets the cache state.
   */
  clear(): void {
    this._currentState = undefined;
    super.clear();
  }
}
