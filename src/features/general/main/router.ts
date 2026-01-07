import { implement } from '@orpc/server';
import { generalContract } from '../shared/contract';

export const generalRouter = implement(generalContract).router({
  getVersions: async () => {
    return {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron,
    };
  },
  getPlatform: async () => {
    return process.platform;
  },
});
