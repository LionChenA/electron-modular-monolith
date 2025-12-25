## 1. Infrastructure Setup
- [x] 1.1 Create `src/app`, `src/features`, `src/shared` directories.
- [x] 1.2 Update `electron.vite.config.ts` to support `@app/main`, `@app/preload`, `@app/renderer`, `@features`, `@shared` aliases.
- [x] 1.3 Update `tsconfig.node.json` and `tsconfig.web.json` `paths` and `include` arrays aligned with ARCHITECTURE_BLUEPRINT.md.

## 2. Code Migration (Lift & Shift)
- [x] 2.1 Move `src/main` contents to `src/app/main`.
- [x] 2.2 Move `src/preload` contents to `src/app/preload`.
- [x] 2.3 Move `src/renderer` contents to `src/app/renderer`.
- [x] 2.4 Mass update relative imports in `src/app/**/*` to point to new locations.
- [x] 2.5 Fix `package.json` scripts if they reference specific paths.

## 3. Verification
- [ ] 3.1 Run `npm run dev` to verify the application starts correctly.
- [ ] 3.2 Verify `ping` IPC (existing functionality) still works.
- [ ] 3.3 Run lint check to ensure no import errors.

## 4. Documentation
- [ ] 4.1 Update `README.md` to document the new folder structure.
