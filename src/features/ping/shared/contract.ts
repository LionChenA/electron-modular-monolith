import { oc } from '@orpc/contract';
import { eventIterator } from '@orpc/server';
import { z } from 'zod';

export const pingContract = {
  sendPing: oc.input(z.void()).output(z.string()),
  onPing: oc.input(z.void()).output(eventIterator(z.string())),
};
