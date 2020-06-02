
import { createOptionsDecorator, ClassType } from '@layerr/core';
import { HttpBackendKeys } from './http-backend.keys';

export const HttpBackend = createOptionsDecorator<string | number, ClassType<any>>(HttpBackendKeys.HTTP_BACKEND_OPTION);
