## Why

The current Storage Explorer page uses a flat two-panel Card layout that lacks visual hierarchy and feels generic. The app also has no navigation system beyond inline links, and is locked to dark mode despite having full light/dark CSS variable definitions.

This change introduces a global navigation system (sidebar activity bar), redesigns the Storage Explorer with a layered layout using shadcn semantic colors, and adds user-controllable theme switching.

## What Changes

- **Add global sidebar navigation** — 48px activity bar with app-level navigation: Home, Storage, Settings. Persists across all pages as part of `__root.tsx`.
- **Rename `/ping` route to `/storage`** — Aligns route path with the page's actual purpose.
- **Redesign Storage Explorer page** — Replace flat Card layout with a layered design: status cards row (4 storage backends with counts), inspector panel (engine metadata + new entry form), and data browser (listing with hover actions).
- **Use shadcn semantic CSS tokens** — All colors use `bg-background`, `text-muted-foreground`, `border-border`, etc. instead of hardcoded values, enabling automatic dark/light mode.
- **Add theme switching** — Integrate `next-themes` ThemeProvider into the app root, wire the `.dark` class toggle.
- **Add theme toggle to header** — Toggle button in the global top bar for dark/light/system.
- **Add Settings page** — New `/settings` route with theme preference selector.
- **Update existing pages (index/root)** — Adapt to new sidebar layout.
- **Remove prototype route** — Delete `prototype.tsx` and prototype artifacts once finalized.

## Capabilities

### New Capabilities
- `theme-switching`: User-controllable dark/light/system theme toggle with persistence via next-themes
- `app-navigation`: Global sidebar activity bar providing page-level navigation across the application

### New Specs (in change)
- `theme-switching` (specs/theme-switching/spec.md)
- `app-navigation` (specs/app-navigation/spec.md)

### Modified Capabilities
- `preferences-storage`, `secure-storage`, `sqlite-database`, `ai-search`: Visual presentation updated with new layout (no API contract changes)

## Impact

### Files Changed
| File | Change |
|------|--------|
| `src/app/renderer/routes/__root.tsx` | Add ThemeProvider + activity bar + top bar layout |
| `src/app/renderer/routes/index.tsx` | Adapt to layout, remove "Go to Ping Page" link, fix devTool typo |
| `src/app/renderer/routes/ping.tsx` | Rename to `storage.tsx`, route path `/ping` → `/storage` |
| `src/app/renderer/routes/storage.tsx` | New (renamed from ping.tsx) |
| `src/app/renderer/routes/settings.tsx` | New: Settings page with theme selector |
| `src/app/renderer/routes/prototype.tsx` | Delete |
| `src/app/renderer/routeTree.gen.ts` | Update: remove prototype, add /settings, rename /ping → /storage |
| `src/features/ping/renderer/page.tsx` | Rewrite with layered layout using semantic tokens |
| `src/features/ping/renderer/components/` 4 files | Update styling to semantic tokens |
| `src/app/renderer/components/ActivityBar.tsx` | New: activity bar component |
| `src/app/renderer/components/TopBar.tsx` | New: top bar component |
| `src/app/renderer/components/ThemeToggle.tsx` | New: theme toggle button |
| `src/features/settings/renderer/` | New: settings page with theme selector |

### Not Changed
- `src/features/ping/` feature module name and internals (sendPing, onPing, ORPC contracts etc. stay as-is)
- No ORPC contract/router/backend changes
- No test changes (functionality preserved)
- No CSS variable changes (existing dark/light variables used directly)
