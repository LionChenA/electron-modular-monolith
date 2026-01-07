import { publicProcedure } from './orpc';

/**
 * The root router for the main process.
 * Feature-specific routers will be registered here in Task 4.3.
 */
export const router = {
  ping: publicProcedure.handler(async () => 'pong'),
};

export type AppRouter = typeof router;
