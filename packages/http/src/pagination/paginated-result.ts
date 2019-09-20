
import { JsonType } from '@swiss/core';

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

  constructor(data: T[], private _pagination: JsonType) {
    this._data = data;

    this._total = <number>this._pagination.total;
    this._lastPage = <number>this._pagination.lastPage || 0;
    this._perPage = <number>this._pagination.itemsPerPage || 0;
    this._currentPage = <number>this._pagination.currentPage || 0;
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
