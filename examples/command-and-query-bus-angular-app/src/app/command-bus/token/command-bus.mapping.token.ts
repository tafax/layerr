
import { InjectionToken } from '@angular/core';
import { MessageHandlerPair } from '@layerr/bus';

export const COMMAND_BUS_MESSAGE_MAPPING = new InjectionToken<MessageHandlerPair[]>('command-bus.mapping.token');
