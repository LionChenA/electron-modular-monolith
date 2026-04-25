import { oc } from '@orpc/contract';
import { eventIterator } from '@orpc/server';
import { z } from 'zod';

const pingRecordSchema = z.object({
  id: z.string(),
  message: z.string(),
  timestamp: z.number(),
  count: z.number().optional(),
});

export type PingRecord = z.infer<typeof pingRecordSchema>;

export const pingContract = {
  sendPing: oc.input(z.void()).output(z.string()),
  onPing: oc.input(z.void()).output(eventIterator(z.string())),
  getPreferences: oc.input(z.object({ key: z.string() })).output(z.unknown()),
  setPreferences: oc.input(z.object({ key: z.string(), value: z.unknown() })).output(z.void()),
  getAllPreferences: oc.input(z.void()).output(z.record(z.string(), z.unknown())),
  storeApiKey: oc.input(z.object({ key: z.string(), value: z.string() })).output(z.void()),
  getApiKey: oc.input(z.object({ key: z.string() })).output(z.string().optional()),
  listApiKeys: oc.input(z.void()).output(z.array(z.string())),
  savePingToDb: oc
    .input(
      z.object({
        message: z.string(),
        timestamp: z.number(),
        count: z.number().optional(),
      }),
    )
    .output(z.object({ id: z.union([z.number(), z.bigint()]) })),
  getPingHistory: oc.input(z.void()).output(z.array(pingRecordSchema)),
  indexPing: oc.input(pingRecordSchema).output(z.void()),
  searchPings: oc
    .input(
      z.object({
        term: z.string(),
        limit: z.number().optional(),
      }),
    )
    .output(z.array(pingRecordSchema)),
};
