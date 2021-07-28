/**
 * Defines a basic interface for all the completion checkers used
 * by the caches to understand when the cache itself is complete.
 *
 * T: It's the type of the state object for the checker.
 */
export interface CompletionCheckerInterface<T> {

  /**
   * Tells if the cache should be reset based on this specific checker.
   * @param newState The new state of the cache.
   * @param prevState The previous state of the cache.
   * @returns True, if the cache should reset the store.
   */
  needsReset(newState?: T, prevState?: T): boolean;

  /**
   * Tells if the cache can be consider complete based on this specific checker.
   * @param state The state of the cache.
   * @returns True if the cache can be consider complete.
   */
  isComplete(state?: T): boolean;
}
