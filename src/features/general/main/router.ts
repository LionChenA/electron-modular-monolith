import { implement } from '@orpc/server';
import { generalContract } from '../shared/contract';

const os = implement(generalContract);

export const generalRouter = os.router({
  getVersions: os.getVersions.handler(async () => {
    return {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron,
    };
  }),
  getPlatform: os.getPlatform.handler(async () => {
    return process.platform;
  }),
});
