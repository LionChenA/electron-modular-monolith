import { oc } from '@orpc/contract';
import { eventIterator } from '@orpc/server';
import { z } from 'zod';

export const pingContract = {
  sendPing: oc.output(z.string()),
  onPing: oc.output(eventIterator(z.string())),
};
