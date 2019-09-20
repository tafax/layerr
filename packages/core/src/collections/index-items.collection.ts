
/**
 * Defines a collection of items.
 */
export class IndexItemsCollection<T, P extends keyof T> {

  /**
   * The items dictionary.
   */
  private _items: Map<string, T> = new Map();

  /**
   * The property used to index the items.
   */
  private _property: P;

  constructor(items: T[] = [], property: P) {
    for (const item of items) {
      const key = item[property];
      this._items.set(`${key}`, item);
    }
    this._property = property;
  }

  /**
   * Normalizes the key used to track the items.
   */
  private _getItemKey(item: string | T): string {
    if (typeof item === 'string') {
      return item;
    }
    return item.toString();
  }

  /**
   * Checks if an item is present in the set.
   */
  has(name: any): boolean {
    return this._items.has(this._getItemKey(name));
  }

  /**
   * Adds a specific item.
   */
  add(item: T) {
    this._items.set(`${item[this._property]}`, item);
  }

  /**
   * Removes a specific item.
   */
  remove(name: any): boolean {
    if (!this.has(this._getItemKey(name))) {
      return;
    }
    return this._items.delete(this._getItemKey(name));
  }

  /**
   * Gets an item by its name.
   */
  get(name: any): T | undefined {
    return this._items.get(this._getItemKey(name));
  }

  /**
   * Gets all the items.
   */
  getAll(): T[] {
    return Array.from(this._items.values());
  }

  /**
   * Clears everything.
   */
  clear() {
    this._items = new Map();
  }

}
