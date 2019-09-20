
/**
 * Basic Core error definition.
 */
export class CoreError extends Error {

  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CoreError.prototype);
  }

}
