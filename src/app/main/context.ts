import { bus } from './infra/bus';

/**
 * MainContext represents the dependencies available to ORPC procedures.
 */
export interface MainContext {
  bus: typeof bus;
  // In the future, we can add:
  // db: IDatabase
  // window: BrowserWindow
}

/**
 * The concrete runtime context object.
 */
export const runtimeContext: MainContext = {
  bus,
};
