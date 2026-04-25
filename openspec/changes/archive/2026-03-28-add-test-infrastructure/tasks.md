## 1. Install Dependencies

- [x] 1.1 Install Vitest: `vitest`, `@vitest/ui`, `@vitest/coverage-v8`, `@vitest/browser`, `@vitest/browser-playwright`
- [x] 1.2 Install Testing Library: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- [x] 1.3 Install Playwright: `@playwright/test`, `playwright`
- [x] 1.4 Install Storybook: `storybook`, `@storybook/react-vite`, `@storybook/addon-vitest`, `@storybook/addon-essentials`, `@storybook/addon-a11y`
- [x] 1.5 Install MSW and ORPC OpenAPI: `msw`, `@orpc/openapi`, `@orpc/zod`
- [x] 1.6 Install other dependencies: `vite-tsconfig-paths`, `happy-dom`, `tsx`

## 2. Configure Vitest

- [x] 2.1 Create `vitest.config.ts` with workspace configuration
- [x] 2.2 Configure renderer project (jsdom environment)
- [x] 2.3 Configure main project (node environment)
- [x] 2.4 Configure storybook project (browser mode with Playwright)
- [x] 2.5 Configure exclude patterns for E2E tests
- [ ] 2.6 Create `tsconfig.vitest.json` for TypeScript configuration

## 3. Configure Testing Libraries

- [x] 3.1 Create `test/vitest.setup.ts` with MSW server setup
- [x] 3.2 Create `test/mocks/server.ts` for MSW configuration
- [x] 3.3 Configure jest-dom matchers

## 4. Configure ORPC OpenAPI Generation

- [x] 4.1 Create `scripts/generate-openapi.ts` script
- [ ] 4.2 Run initial OpenAPI generation to create `test/mocks/openapi.json`

## 5. Configure Playwright

- [x] 5.1 Create `playwright.config.ts`
- [x] 5.2 Configure test directory and patterns
- [ ] 5.3 Install Playwright browsers

## 6. Configure Storybook

- [x] 6.1 Initialize Storybook with `npx storybook@latest init`
- [x] 6.2 Configure `.storybook/main.ts`
- [x] 6.3 Configure `.storybook/preview.tsx`
- [x] 6.4 Configure `.storybook/vitest.setup.ts` for Storybook testing

## 7. Update package.json Scripts

- [x] 7.1 Add test scripts: `test`, `test:watch`, `test:main`, `test:renderer`, `test:component`
- [x] 7.2 Add E2E scripts: `test:e2e`, `test:all`
- [x] 7.3 Add Storybook scripts: `storybook`, `storybook:build`
- [x] 7.4 Add OpenAPI generation script: `openapi:generate`

## 8. Create Example Tests

- [x] 8.1 Create unit test example: `src/shared/utils/format.test.ts`
- [x] 8.2 Create integration test example: `src/features/ping/ping.integration.test.ts`
- [x] 8.3 Create component story example: `src/features/ping/Ping.stories.tsx`
- [x] 8.4 Create E2E test example: `test/e2e/app.e2e.test.ts`

## 9. Verify Pipeline

- [ ] 9.1 Run `pnpm test` - verify unit/integration tests work
- [ ] 9.2 Run `pnpm test:e2e` - verify E2E tests work
- [ ] 9.3 Run `pnpm storybook` - verify Storybook starts
- [ ] 9.4 Verify all tests can run successfully
