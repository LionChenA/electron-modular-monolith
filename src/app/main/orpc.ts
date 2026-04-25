import { os } from '@orpc/server';
import type { MainContext } from './context';
import { getRuntimeContext } from './context';

export const publicProcedure = os.$context<MainContext>();

const withDeps = publicProcedure.middleware(async ({ next }) => {
  const ctx = getRuntimeContext();
  return next({ context: ctx });
});

export const procedure = publicProcedure.use(withDeps);
