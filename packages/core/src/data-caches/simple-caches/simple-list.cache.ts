
// Declares the cachable type.
export interface CacheableItem {
  id: string | number;
}

/**
 * Defines a simple cache to handle a list of items.
 *
 * Features:
 * - It can store in memory a set of generic items.
 * - It can return the whole set.
 * - It can return a specific item based on the ID.
 * - It can clear the set.
 */
export class SimpleListCache<T extends CacheableItem> {

  /**
   * The cached items are stored here.
   */
  protected _items: Map<string, T> = new Map();

  /**
   * Normalizes the key to a string.
   */
  private _normalizeKey(key: string | number | undefined | null): string {
    return `key:${!!key ? key.toString() : typeof key}`;
  }

  /**
   * Tells if the cache is handling a value with the same key.
   */
  hasKey(key: string | number): boolean {
    return this._items.has(this._normalizeKey(key));
  }

  /**
   * Checks if the cache contains items.
   */
  hasItems(): boolean {
    return this._items.size > 0;
  }

  /**
   * Gets all the cached items.
   */
  getItems(): T[] {
    return Array.from(this._items.values());
  }

  /**
   * Gets a specific item based on its key.
   */
  getItem(key: string | number): T {
    return this._items.get(this._normalizeKey(key));
  }

  /**
   * Adds more items to the cache.
   */
  pushItems(items: T[]) {
    items.forEach((value: T) => this.pushItem(value));
  }

  /**
   * Adds one item to the cache.
   */
  pushItem(item: T) {
    this._items.set(this._normalizeKey(item.id), item);
  }

  /**
   * Deletes one item from the cache.
   */
  deleteItem(key: string | number) {
    this._items.delete(this._normalizeKey(key));
  }

  /**
   * Removes all the cached items.
   */
  clear() {
    this._items = new Map();
  }
}
