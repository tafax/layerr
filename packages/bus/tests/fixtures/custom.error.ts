
export class CustomError extends Error {

  constructor() {
    super();

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CustomError.prototype);
  }

}
