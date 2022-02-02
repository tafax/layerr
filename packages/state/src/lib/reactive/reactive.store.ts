import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '../store';

/**
 * Defines the base selector object
 * It should be used when we want to implement a reactive selector behavior
 */
export abstract class ReactiveStore<TState> implements Store<TState, Observable<TState>>{
  /**
   * The subject used to emits and store the state
   */
  private readonly _subject: BehaviorSubject<TState> = new BehaviorSubject(this.getInitialState());

  /**
   * The transaction state to use
   */
  private _transactionState: TState | undefined;

  /**
   * @inheritdoc
   */
  get initialState(): TState {
    return this.getInitialState();
  }

  /**
   * Subscribes to the state changes
   */
  getState$(): Observable<TState> {
    return this._subject.asObservable();
  }

  /**
   * @inheritdoc
   */
  startTransaction(): void {
    if (this._transactionState) {
      throw new Error('Before starting a new transaction please commit or rollback the current one');
    }

    this._transactionState = Object.assign({}, this._subject.getValue());
  }

  /**
   * @inheritdoc
   */
  commitTransaction(): void {
    if (!this._transactionState) {
      throw new Error('Unable to commit an undefined transaction');
    }

    this._subject.next(this._transactionState);
    this._transactionState = undefined;
  }

  /**
   * @inheritdoc
   */
  rollbackTransaction(): void {
    this._transactionState = undefined;
  }

  /**
   * Method used to trigger an update of the state
   * @param map A map function that receives as input the current state and based on that should return the new one
   */
  protected setState(map: (state: TState) => TState): void {
    if (this._transactionState) {
      this._transactionState = map(this._transactionState);
      return;
    }

    this._subject.next(map(this._subject.getValue()));
  }

  /**
   * Gets the initial state defined by the sub class
   */
  protected abstract getInitialState(): TState;
}
