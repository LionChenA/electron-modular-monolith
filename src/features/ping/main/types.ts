import type { EventBus } from '../../../app/main/infra/bus';

export interface PingDeps {
  bus: EventBus;
}
