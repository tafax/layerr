
import { CompletionCheckerInterface } from './completion-checker.interface';
import { RemoteListState } from '../simple-caches/states/remote-list.state';

/**
 * Defines the strategy to check if the cache is complete or not when we deal with a paginated list
 * that can be sorted and for which we can perform searches.
 *
 * How the list should work to use this checker?
 * - The list should be split into pages.
 * - We can sort the list with different criteria.
 * - We can perform searches to retrieve just some of the items.
 *
 * NOTE: The fundamental assumption is that the pages are loaded sequentially, from the first to the last one.
 */
export class PaginatedListCompletionChecker
  implements CompletionCheckerInterface<RemoteListState> {

  /**
   * @inheritDoc
   */
  needsReset(newState?: RemoteListState, prevState?: RemoteListState): boolean {
    return newState && prevState && newState.orderBy !== prevState.orderBy;
  }

  /**
   * @inheritDoc
   */
  isComplete(state?: RemoteListState): boolean {
    return state // The cache is complete if the cache state is defined...
      && state.loadedPagesCount === state.totalPages // ...the number of loaded pages equals the number of total pages...
      && !(state.loadedPagesCount === 1 && state.itemsCount === 0); // ...and we didn't load only one empty page.
  }

}
