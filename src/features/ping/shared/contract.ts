import { oc } from '@orpc/contract';
import { eventIterator } from '@orpc/server';
import { z } from 'zod';

export const pingContract = oc.router({
  ping: oc.output(z.string()),
  onPing: oc.output(eventIterator(z.string())),
});
