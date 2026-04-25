import type {
  IDatabase,
  ISearchEngine,
  Preferences,
  Secrets,
} from '../../../app/main/infra/storage';
import type { EventBus } from '../../../shared/interfaces/bus';

export interface PingDeps {
  bus: EventBus;
  prefs: Preferences;
  secrets: Secrets;
  db: IDatabase;
  ai: ISearchEngine;
}
