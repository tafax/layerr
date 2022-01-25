import { createOptionsDecorator, ClassType } from '@layerr/core';
import { HttpBackendKeys } from './http-backend.keys';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HttpBackend = createOptionsDecorator<string | number, ClassType<any>>(HttpBackendKeys.HTTP_BACKEND_OPTION);
