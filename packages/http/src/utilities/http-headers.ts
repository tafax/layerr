
/**
 * Defines the HTTP headers class.
 */
export class HttpHeaders implements Headers {

  /**
   * The map to use to store values.
   */
  private _map: Map<string, string>;

  constructor(headers?: HttpHeaders | string[][] | Record<string, string>) {

    this._map = new Map();

    if (!headers) {
      return;
    }

    if (Array.isArray(headers)) {
      this._map = new Map(headers as unknown as readonly [ string, string ][]);
      return;
    }

    if (headers instanceof HttpHeaders) {
      headers.forEach(
        (value: string, key: string) => this._map.set(key, value)
      );
      return;
    }

    const headersInit = headers as Record<string, string>;
    Object.keys(headersInit).forEach((key: string) => this._map.set(key, (headersInit[key])));
  }

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

  /**
   * Converts the headers into a JSON object.
   */
  toObject(): Record<string, string> {
    let obj = {};
    for (const key of Array.from(this._map.keys())) {
      obj = {
        ...obj,
        [key]: this._map.get(key)
      };
    }
    return obj;
  }

}
