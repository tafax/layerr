
import { suite } from '@layerr/test';
import { LoginRequest } from '../fixtures/login.request';

@suite class LoginRequestIntegrationTests {

  private loginRequest: LoginRequest;

  before() {
    this.loginRequest = new LoginRequest('user', 'pass');
  }

  @test 'should create the request for the login'() {
    this.loginRequest.getBody().username.should.be.eql('user');
    this.loginRequest.getBody().password.should.be.eql('pass');
  }

  @test 'should clone the request for the login'() {
    const request = this.loginRequest.clone({ query: { param: 'param' } });

    request.getQuery().has('param').should.be.true;
    request.getQuery().get('param').should.be.eql('param');

    request.getBody().username.should.be.eql('user');
    request.getBody().password.should.be.eql('pass');

    request.should.be.instanceof(LoginRequest);
  }

}
