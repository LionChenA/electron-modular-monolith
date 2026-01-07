import { os } from '@orpc/server';

/**
 * MainContext will be fully defined in Task 3.1
 * It represents the dependencies injected into every ORPC procedure in the main process.
 */
export type MainContext = {};

export const publicProcedure = os.context<MainContext>();
