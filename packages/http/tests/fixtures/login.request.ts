
import { JsonType } from '@layerr/core';
import { AbstractRequest } from '../../src/request/abstract.request';

export class LoginRequest extends AbstractRequest {

  constructor(
    private readonly username: string,
    private readonly password: string,
  ) {
    super({
      path: '/login',
      version: 'v1'
    });
  }

  getBody(): JsonType | null {
    return {
      username: this.username,
      password: this.password
    };
  }

}
