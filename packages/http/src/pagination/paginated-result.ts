
import { PaginationInterface } from './pagination.interface';

/**
 * Defines a convenience object to expose the data of a request together
 * with its pagination info.
 */
export class PaginatedResult<T> {

  /**
   * The data of the response.
   */
  private _data: T[];

  /**
   * The total expected number of entities.
   */
  private _total: number;

  /**
   * The last page expected from the pagination.
   */
  private _lastPage: number;

  /**
   * The number of items per page.
   */
  private _perPage: number;

  /**
   * The current page of this set of data.
   */
  private _currentPage: number;

  constructor(data: T[], pagination: PaginationInterface) {
    this._data = data;

    this._total = pagination.total as number || 0;
    this._lastPage = pagination.lastPage as number || 0;
    this._perPage = pagination.itemsPerPage as number || 0;
    this._currentPage = pagination.currentPage as number || 0;
  }

  /**
   * Gets the data.
   */
  get data(): T[] {
    return this._data;
  }

  /**
   * Gets the total number of entities.
   */
  get total(): number {
    return this._total;
  }

  /**
   * Gets the last page.
   */
  get lastPage(): number {
    return this._lastPage;
  }

  /**
   * Gets the number of entities per page.
   * @returns {count}
   */
  get perPage(): number {
    return this._perPage;
  }

  /**
   * Gets the current page.
   * @returns {count}
   */
  get currentPage(): number {
    return this._currentPage;
  }

  /**
   * True, if the current page can be considered the last one.
   * @returns {boolean}
   */
  isLast(): boolean {
    return this.currentPage === this.lastPage;
  }

}
