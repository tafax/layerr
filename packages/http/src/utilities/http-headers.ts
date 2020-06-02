
/**
 * Defines the HTTP headers class.
 */
export class HttpHeaders implements Headers {

  /**
   * The map to use to store values.
   */
  private _map: Map<string, string> = new Map();

  /**
   * @inheritDoc
   */
  append(name: string, value: string): void {
    // TODO: Implements a real append.
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
  set(name: string, value: string): void {
    this._map.set(name, value);
  }

  /**
   * @inheritDoc
   */
  forEach(callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
    this._map.forEach(
      (value, key) => callbackfn(value, key, this),
      thisArg
    );
  }

}
