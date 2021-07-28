import { suite, test } from '@testdeck/jest';
import { mock, instance } from 'ts-mockito';
import { JsonType } from '../../../core/src/lib/utilities/json-type';
import { HttpExecution } from '../../src/lib/http-execution';
import { RequestInterface } from '../../src/lib/request/request.interface';
import { RemoteResponse } from '../../src/lib/response/remote-response';

@suite
class HttpExecutionUnitTest {
  @test
  givenData_whenConstruct_thenCreateExecution() {
    const request = mock<RequestInterface>();
    const response = mock<RemoteResponse<JsonType>>();

    const execution = new HttpExecution({
      request: instance(request),
      response: instance(response),
      content: {},
      baseHost: 'baseHost',
      retryAttemptCount: 0,
      retryDelay: 0,
      timeout: 0,
    });

    expect(execution.request).toBe(instance(request));
    expect(execution.response).toBe(instance(response));
    expect(execution.baseHost).toStrictEqual('baseHost');
    expect(execution.retryAttemptCount).toStrictEqual(0);
    expect(execution.retryDelay).toStrictEqual(0);
    expect(execution.timeout).toStrictEqual(0);

    expect(execution.hasResponse()).toBeTruthy();
    expect(execution.hasContent()).toBeTruthy();
  }

  @test
  whenClone_thenReturnClone() {
    const request = mock<RequestInterface>();

    const execution = new HttpExecution({
      request: instance(request),
      baseHost: 'baseHost',
      retryAttemptCount: 0,
      retryDelay: 0,
      timeout: 0,
    });

    expect(execution.request).toBe(instance(request));
    expect(execution.baseHost).toStrictEqual('baseHost');
    expect(execution.retryAttemptCount).toStrictEqual(0);
    expect(execution.retryDelay).toStrictEqual(0);
    expect(execution.timeout).toStrictEqual(0);

    expect(execution.hasResponse()).toBeFalsy();
    expect(execution.hasContent()).toBeFalsy();

    const clone = execution.clone();

    expect(clone.request).toBe(instance(request));
    expect(clone.baseHost).toStrictEqual('baseHost');
    expect(clone.retryAttemptCount).toStrictEqual(0);
    expect(clone.retryDelay).toStrictEqual(0);
    expect(clone.timeout).toStrictEqual(0);

    expect(clone.hasResponse()).toBeFalsy();
    expect(clone.hasContent()).toBeFalsy();

    const newRequest = mock<RequestInterface>();
    const response = mock<RemoteResponse<JsonType>>();

    const nextClone = execution.clone({
      response: instance(response),
      request: instance(newRequest),
      content: {},
    });

    expect(nextClone.request).toBe(instance(newRequest));
    expect(nextClone.response).toBe(instance(response));
    expect(nextClone.baseHost).toStrictEqual('baseHost');
    expect(nextClone.retryAttemptCount).toStrictEqual(0);
    expect(nextClone.retryDelay).toStrictEqual(0);
    expect(nextClone.timeout).toStrictEqual(0);

    expect(nextClone.hasResponse()).toBeTruthy();
    expect(nextClone.hasContent()).toBeTruthy();
  }
}
