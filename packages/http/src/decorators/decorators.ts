
import { createOptionsDecorator } from '@swiss/core';
import { RemoteCallOptions } from './configurations/remote-call.options';
import { RequestServiceDecoratorsKeys } from './request-service-decorators.keys';

export const RemoteCall = createOptionsDecorator<RemoteCallOptions<any>, any>(
  RequestServiceDecoratorsKeys.REMOTE_CALL_OPTIONS
);
