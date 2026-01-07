import { oc } from '@orpc/contract';
import { z } from 'zod';

export const generalContract = oc.router({
  getVersions: oc.output(
    z.object({
      node: z.string(),
      chrome: z.string(),
      electron: z.string(),
    }),
  ),
  getPlatform: oc.output(z.string()),
});
