import { generalRouter } from '../../features/general/main/router';
import { pingRouter } from '../../features/ping/main/router';

/**
 * The root router for the main process.
 * Registers all feature routers.
 */
export const router = {
  general: generalRouter,
  ping: pingRouter,
};

export type AppRouter = typeof router;
