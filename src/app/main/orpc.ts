import { os } from '@orpc/server';
import type { MainContext } from './context';

export const publicProcedure = os.$context<MainContext>();
