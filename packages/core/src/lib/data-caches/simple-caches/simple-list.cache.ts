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
  private static NormalizeKey(key: string | number | undefined | null): string {
    return `key:${key ? key.toString() : typeof key}`;
  }

  /**
   * Tells if the cache is handling a value with the same key.
   */
  hasKey(key: string | number): boolean {
    return this._items.has(SimpleListCache.NormalizeKey(key));
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
    return this._items.get(SimpleListCache.NormalizeKey(key));
  }

  /**
   * Adds more items to the cache.
   */
  pushItems(items: T[]): void {
    items.forEach((value: T) => this.pushItem(value));
  }

  /**
   * Adds one item to the cache.
   */
  pushItem(item: T): void {
    this._items.set(SimpleListCache.NormalizeKey(item.id), item);
  }

  /**
   * Deletes one item from the cache.
   */
  deleteItem(key: string | number): void {
    this._items.delete(SimpleListCache.NormalizeKey(key));
  }

  /**
   * Removes all the cached items.
   */
  clear(): void {
    this._items = new Map();
  }
}
