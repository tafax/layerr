
/**
 * Defines a simple type to identify the state for this checker.
 */
export interface RemoteListState {

  /**
   * Keeps track of the sorting criteria used in the last request.
   */
  orderBy?: string;

  /**
   * Keeps track of the number of sequentially loaded pages.
   */
  loadedPagesCount?: number;

  /**
   * Keeps track of the number of sequentially loaded pages.
   */
  totalPages?: number;

  /**
   * Keeps track of the number of items count.
   */
  itemsCount?: number;

}
