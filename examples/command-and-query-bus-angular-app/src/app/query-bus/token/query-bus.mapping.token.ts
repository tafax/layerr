
import { InjectionToken } from '@angular/core';
import { MessageHandlerPair } from '@layerr/bus';

export const QUERY_BUS_MESSAGE_MAPPING = new InjectionToken<MessageHandlerPair[]>('query-bus.mapping.token');
