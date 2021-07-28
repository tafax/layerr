// Defines the http params init type.
export declare type HttpParamsInit = HttpParams | string[][] | Record<string, string>;

interface HttpParamsUpdate {
  name: string;
  value?: string;
  op: 'w' | 'd' | 'a';
}

/**
 * Defines the HTTP params class.
 */
export class HttpParams implements URLSearchParams {

  /**
   * The map to use to store values.
   */
  private readonly _map: Map<string, string[]> = new Map();

  constructor(params?: HttpParamsInit) {

    if (!params) {
      return;
    }

    if (Array.isArray(params)) {
      this._map = new Map(params.map(value => [ value[0], value[1].split(',') ]));
      return;
    }

    if (params instanceof HttpParams) {
      params.forEach(
        (value: string, key: string) => this._map.set(key, value.split(',')),
      );
      return;
    }

    const headersInit = params as Record<string, string>;
    Object.keys(headersInit).forEach((key: string) => this._map.set(key, headersInit[key].split(',')));
  }

  /**
   * @inheritDoc
   */
  append(name: string, value: string): HttpParams {
    if (!value) {
      return this;
    }
    return this.clone({ name, value, op: 'a' });
  }

  /**
   * @inheritDoc
   */
  delete(name: string): HttpParams {
    if (!this.has(name)) {
      return this;
    }
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
    if (!this._map.has(name)) {
      return null;
    }
    return this._map.get(name)?.join(',');
  }

  /**
   * @inheritDoc
   */
  getAll(name: string): string[] {
    if (!this._map.has(name)) {
      return [];
    }
    //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._map.get(name)!;
  }

  /**
   * @inheritDoc
   */
  set(name: string, value: string): HttpParams {
    // We don't set undefined values.
    if (!value) {
      return this;
    }
    return this.clone({ name, value, op: 'w' });
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
  forEach(callbackfn: (value: string, key: string, parent: URLSearchParams) => void, thisArg?: unknown): void {
    this._map.forEach(
      (value, key) => callbackfn(value.join(','), key, this),
      thisArg,
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
      .map((key: string) => encodeURIComponent(key) + '=' + encodeURIComponent(this._map.get(key)?.join(',')))
      .join('&');
  }

  /**
   * Converts the headers into a JSON object.
   */
  toObject(): Record<string, string> {
    let obj = {};
    for (const key of Array.from(this._map.keys())) {
      obj = {
        ...obj,
        [key]: this._map.get(key)?.join(','),
      };
    }
    return obj;
  }

  /**
   * Clones the headers.
   */
  clone(update?: HttpParamsUpdate): HttpParams {
    if (!update) {
      return new HttpParams(this);
    }

    if (update.op === 'd') {
      const object = this.toObject();
      let toCreate = {};
      for (const key of Object.keys(object)) {
        if (key === update.name) {
          continue;
        }
        toCreate = Object.assign(toCreate, { [key]: object[key] });
      }
      return new HttpParams(toCreate);
    }

    if (update.op === 'a') {
      const object = this.toObject();
      let toCreate = {};

      if (Object.keys(object).includes(update.name)) {
        for (const key of Object.keys(object)) {
          if (key === update.name) {
            toCreate = Object.assign(toCreate, { [key]: [ ...object[key].split(','), update.value ].join(',') });
          } else {
            toCreate = Object.assign(toCreate, { [key]: object[key] });
          }
        }
      } else {
        toCreate = {
          ...object,
          //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          [update.name]: update.value!,
        };
      }
      return new HttpParams(toCreate);
    }

    return new HttpParams({
      ...this.toObject(),
      //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      [update.name]: update.value!,
    } as HttpParamsInit);
  }
}
