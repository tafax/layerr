/**
 * Defines the pagination interface to
 * get the pagination data.
 */
export interface PaginationInterface {
  /**
   * The total count.
   */
  readonly total: number;

  /**
   * The last page.
   */
  readonly lastPage: number;

  /**
   * The number of items per page.
   */
  readonly itemsPerPage: number;

  /**
   * The current page number.
   */
  readonly currentPage: number;
}
