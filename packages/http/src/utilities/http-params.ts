
/**
 * Defines the HTTP params class.
 */
export class HttpParams implements URLSearchParams {

  /**
   * The map to use to store values.
   */
  private _map: Map<string, string> = new Map();

  /**
   * @inheritDoc
   */
  append(name: string, value: string): void {
    // Right now, we just support a single value for a key.
    this._map.set(name, value);
  }

  /**
   * @inheritDoc
   */
  delete(name: string): void {
    this._map.delete(name);
  }

  /**
   * @inheritDoc
   */
  has(name: string): boolean {
    return this._map.has(name);
  }

  /**
   * @inheritDoc
   */
  get(name: string): string | null {
    return this._map.get(name) || null;
  }

  /**
   * @inheritDoc
   */
  getAll(name: string): string[] {
    if (!this._map.has(name)) {
      return [];
    }
    return [ this._map.get(name)! ];
  }

  /**
   * @inheritDoc
   */
  set(name: string, value: string): void {
    // We don't set undefined values.
    if (!value) {
      return;
    }
    this._map.set(name, value);
  }

  /**
   * @inheritDoc
   */
  /* istanbul ignore next */
  sort(): void {
    // Not implemented!
  }

  /**
   * @inheritDoc
   */
  forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: any): void {
    this._map.forEach(
      (value, key) => callbackfn(value, key, this),
      thisArg
    );
  }

  /**
   * Tells if the params are empty or not.
   */
  isEmpty(): boolean {
    return Array.from(this._map.keys()).length === 0;
  }

  /**
   * Converts the params into a query string.
   */
  toString(): string {
    return Array.from(this._map.keys())
      .map((key: string) => encodeURIComponent(key) + '=' + encodeURIComponent(this._map.get(key)!))
      .join('&');
  }

}
