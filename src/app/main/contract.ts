import { generalContract } from '../../features/general/shared/contract';
import { pingContract } from '../../features/ping/shared/contract';

export const appContract = {
  general: generalContract,
  ping: pingContract,
};

export type AppContract = typeof appContract;
