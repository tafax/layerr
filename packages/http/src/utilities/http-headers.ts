
interface HttpHeadersUpdate {
  name: string;
  value?: string;
  op: 'w' | 'd';
}

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
  append(name: string, value: string): HttpHeaders {
    return this.clone({ name, value, op: 'w' });
  }

  /**
   * @inheritDoc
   */
  delete(name: string): HttpHeaders {
    return this.clone({ name, op: 'd' });
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
  set(name: string, value: string): HttpHeaders {
    return this.clone({ name, value, op: 'w' });
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

  /**
   * Clones the headers.
   */
  clone(update?: HttpHeadersUpdate): HttpHeaders {
    if (!update) {
      return new HttpHeaders(this);
    }

    if (update.op === 'd') {
      const object = this.toObject();
      let toCreate = {};
      for (const key of Object.keys(object)) {
        if (key === update.name) {
          continue;
        }
        toCreate = Object.assign(toCreate, { [key]: update.value });
      }
      return new HttpHeaders(toCreate);
    }
    return new HttpHeaders({
      ...this.toObject(),
      [update.name]: update.value!
    });
  }

}
