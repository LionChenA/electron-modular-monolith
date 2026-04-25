import { setupServer } from 'msw/node';
import {
  pingSendPingHandler,
  pingGetPreferencesHandler,
  pingSetPreferencesHandler,
  pingStoreApiKeyHandler,
  pingGetApiKeyHandler,
  pingListApiKeysHandler,
  pingSavePingToDbHandler,
  pingGetPingHistoryHandler,
  pingIndexPingHandler,
  pingSearchPingsHandler,
  generalGetVersionsHandler,
  generalGetPlatformHandler,
} from './gen/msw/index';

export const handlers = [
  pingSendPingHandler(),
  pingGetPreferencesHandler(),
  pingSetPreferencesHandler(),
  pingStoreApiKeyHandler(),
  pingGetApiKeyHandler(),
  pingListApiKeysHandler(),
  pingSavePingToDbHandler(),
  pingGetPingHistoryHandler(),
  pingIndexPingHandler(),
  pingSearchPingsHandler(),
  generalGetVersionsHandler(),
  generalGetPlatformHandler(),
];

export const server = setupServer(...handlers);