## 1. Root Layout — ThemeProvider + Sidebar

- [ ] 1.1 Add ThemeProvider wrapping the root layout in `__root.tsx`
- [ ] 1.2 Create ActivityBar component (48px left sidebar with Home/Storage/Settings icons)
- [ ] 1.3 Create TopBar component (page title + theme toggle button)
- [ ] 1.4 Update `__root.tsx` to render ActivityBar + TopBar + Outlet layout
- [ ] 1.5 Remove `className="dark"` from all page-level wrappers (ThemeProvider handles it)

## 2. Theme Toggle + next-themes Integration

- [ ] 2.1 Create ThemeToggle component (button in TopBar that cycles dark/light/system)
- [ ] 2.2 Configure next-themes ThemeProvider with `attribute="class" defaultTheme="dark" enableSystem`

## 3. Settings Page

- [ ] 3.1 Create `src/app/renderer/routes/settings.tsx` with theme selector (Light/Dark/System buttons)
- [ ] 3.2 Add `/settings` route to `routeTree.gen.ts`

## 4. Route Rename: /ping → /storage

- [ ] 4.1 Rename route file: `ping.tsx` → `storage.tsx`
- [ ] 4.2 Update route path from `/ping` to `/storage` in route files
- [ ] 4.3 Update all internal links pointing to `/ping`
- [ ] 4.4 Update `routeTree.gen.ts`

## 5. Redesign Storage Explorer Page

- [ ] 5.1 Create StatusCardsRow component (4 storage backend cards with counts, clickable)
- [ ] 5.2 Create InspectorPanel component (engine metadata + new entry form)
- [ ] 5.3 Create DataBrowser component (entry list with hover-reveal actions)
- [ ] 5.4 Rewrite `page.tsx` with new layered layout (StatusCards + InspectorPanel + DataBrowser)
- [ ] 5.5 Update ActionPanel, DataList, EmptyState, SecretCell to use shadcn semantic colors

## 6. Update Home Page

- [ ] 6.1 Remove "Go to Ping Page" inline link (navigation moved to activity bar)
- [ ] 6.2 Ensure home page layout works within the new root layout

## 7. Cleanup

- [ ] 7.1 Delete prototype route and files
- [ ] 7.2 Update routeTree.gen.ts to remove prototype route

## 8. Verification

- [ ] 8.1 Run `pnpm test:smoke` - verify app compiles, starts, and renders
- [ ] 8.2 Run `pnpm test` - verify all 155 tests pass
- [ ] 8.3 Run `pnpm typecheck` - verify types pass
- [ ] 8.4 Run `pnpm build` - verify production build passes
- [ ] 8.5 Manual: verify theme toggle cycles dark/light/system correctly
- [ ] 8.6 Agent-browser: verify activity bar navigation works (Home/Storage/Settings)
- [ ] 8.7 Agent-browser: verify Storage Explorer tab switching + CRUD layout
- [ ] 8.8 Manual: verify Settings page theme selector works
