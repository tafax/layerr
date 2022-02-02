/**
 * Represents the store class.
 * Any Store is a specific set of operations to apply to the state.
 */
export interface Store<TState, UStateWrapper> {
  /**
   * The initial state of the selector
   */
  get initialState(): TState;

  /**
   * Subscribes to the state changes
   */
  getState$(): UStateWrapper;

  /**
   * Starts a new transaction
   */
  startTransaction(): void;

  /**
   * Commits a transaction
   */
  commitTransaction(): void;

  /**
   * Rollbacks a transaction
   */
  rollbackTransaction(): void;
}
