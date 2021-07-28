import { suite, test } from '@testdeck/jest';
import { LoginRequest } from '../fixtures/login.request';

@suite
class LoginRequestIntegrationTest {

  private SUT: LoginRequest;

  before() {
    this.SUT = new LoginRequest('user', 'pass');
  }

  @test
  whenGetBody_thenReturnBody() {
    expect(this.SUT.getBody()).toStrictEqual({
      username: 'user',
      password: 'pass',
    });
  }

  @test
  whenClone_thenReturnCloned() {
    const request = this.SUT.clone({ query: { param: 'param' } });

    expect(request.getQuery().has('param')).toBeTruthy();
    expect(request.getQuery().get('param')).toStrictEqual('param');

    expect(this.SUT.getBody()).toStrictEqual({
      username: 'user',
      password: 'pass',
    });

    expect(request).toBeInstanceOf(LoginRequest);
  }
}
