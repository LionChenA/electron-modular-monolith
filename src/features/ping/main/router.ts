import { z } from 'zod';
import { procedure } from '../../../app/main/orpc';

const pingRecordSchema = z.object({
  id: z.string(),
  message: z.string(),
  timestamp: z.number(),
  count: z.number().optional(),
});

export const pingRouter = procedure.router({
  sendPing: procedure.input(z.void()).handler(async ({ context }) => {
    context.bus.publish('ping', 'pong');
    return 'pong';
  }),
  onPing: procedure.input(z.void()).handler(async function* ({ context, signal }) {
    for await (const data of context.bus.subscribe('ping', signal)) {
      yield String(data);
    }
  }),
  getPreferences: procedure
    .input(z.object({ key: z.string() }))
    .handler(async ({ context, input }) => {
      return context.prefs.get(input.key);
    }),
  setPreferences: procedure
    .input(z.object({ key: z.string(), value: z.unknown() }))
    .handler(async ({ context, input }) => {
      context.prefs.set(input.key, input.value);
    }),
  getAllPreferences: procedure.input(z.void()).handler(async ({ context }) => {
    return context.prefs.values;
  }),
  storeApiKey: procedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .handler(async ({ context, input }) => {
      context.secrets.set(input.key, input.value);
    }),
  getApiKey: procedure.input(z.object({ key: z.string() })).handler(async ({ context, input }) => {
    return context.secrets.get(input.key);
  }),
  listApiKeys: procedure.input(z.void()).handler(async ({ context }) => {
    return context.secrets.keys;
  }),
  savePingToDb: procedure
    .input(
      z.object({
        message: z.string(),
        timestamp: z.number(),
        count: z.number().optional(),
      }),
    )
    .handler(async ({ context, input }) => {
      const id = context.db.insert('pings', {
        message: input.message,
        timestamp: input.timestamp,
        count: input.count,
      });
      return { id };
    }),
  getPingHistory: procedure.input(z.void()).handler(async ({ context }) => {
    const rows = context.db.query<{
      id: number;
      message: string;
      timestamp: number;
      count?: number;
    }>('SELECT * FROM pings ORDER BY timestamp DESC LIMIT 100');
    return rows.map((row) => ({
      id: String(row.id),
      message: row.message,
      timestamp: row.timestamp,
      count: row.count,
    }));
  }),
  indexPing: procedure.input(pingRecordSchema).handler(async ({ context, input }) => {
    await context.ai.insert(input);
  }),
  searchPings: procedure
    .input(
      z.object({
        term: z.string(),
        limit: z.number().optional(),
      }),
    )
    .handler(async ({ context, input }) => {
      const result = await context.ai.search<{
        id: string;
        message: string;
        timestamp: number;
        count?: number;
      }>({
        term: input.term,
        limit: input.limit ?? 10,
      });
      return result.hits.map((hit) => hit.document);
    }),
});
