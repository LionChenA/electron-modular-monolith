## 1. Root Layout — ThemeProvider + Sidebar ✅

- [x] 1.1 Add ThemeProvider wrapping the root layout in `__root.tsx`
- [x] 1.2 Create ActivityBar component (48px left sidebar with Home/Storage/Settings icons)
- [x] 1.3 Create TopBar component (page title + theme toggle button)
- [x] 1.4 Update `__root.tsx` to render ActivityBar + TopBar + Outlet layout
- [x] 1.5 Remove `className="dark"` from all page-level wrappers (ThemeProvider handles it)

## 2. Theme Toggle + next-themes Integration ✅

- [x] 2.1 Create ThemeToggle component (button in TopBar that cycles dark/light/system)
- [x] 2.2 Configure next-themes ThemeProvider with `attribute="class" defaultTheme="dark" enableSystem`

## 3. Settings Page ✅

- [x] 3.1 Create `src/app/renderer/routes/settings.tsx` with theme selector (Light/Dark/System buttons)
- [x] 3.2 Add `/settings` route to `routeTree.gen.ts`

## 4. Route Rename: /ping → /storage ✅

- [x] 4.1 Rename route file: `ping.tsx` → `storage.tsx`
- [x] 4.2 Update route path from `/ping` to `/storage` in route files
- [x] 4.3 Remove "Go to Ping Page" link (replaced by activity bar)
- [x] 4.4 Update `routeTree.gen.ts`

## 5. Redesign Storage Explorer Page ✅

- [x] 5.1 Create StatusCardsRow component (4 storage backend cards with counts, clickable)
- [x] 5.2 Create InspectorPanel component (engine metadata + new entry form)
- [x] 5.3 Create DataBrowser component (entry list with hover-reveal actions)
- [x] 5.4 Rewrite `page.tsx` with new layered layout (StatusCards + InspectorPanel + DataBrowser)
- [x] 5.5 Update ActionPanel, DataList, EmptyState, SecretCell to use shadcn semantic colors

## 6. Update Home Page ✅

- [x] 6.1 Remove "Go to Ping Page" inline link (navigation moved to activity bar)
- [x] 6.2 Ensure home page layout works within new root layout (removed dark class, fixed sizing)

## 7. Cleanup ✅

- [x] 7.1 Delete prototype route and files
- [x] 7.2 Update routeTree.gen.ts to remove prototype route (no prototype refs)

## 8. Verification ✅

- [x] 8.1 Run `pnpm test:smoke` - verify app compiles, starts, and renders
- [x] 8.2 Run `pnpm test` - verify all 155 tests pass
- [x] 8.3 Run `pnpm typecheck` - verify types pass
- [x] 8.4 Run `pnpm build` - verify production build passes
- [x] 8.5 Manual: verify theme toggle cycles dark/light correctly
- [x] 8.6 Agent-browser: verify activity bar navigation works (Home/Storage/Settings)
- [x] 8.7 Visual: verify Storage Explorer new layout (agent-browser screenshot confirmed)
- [x] 8.8 Manual: verify Settings page theme selector works (agent-browser snapshot confirmed)
