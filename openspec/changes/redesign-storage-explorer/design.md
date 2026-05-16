## Context

The current app has no navigation infrastructure — pages are accessed through inline links on the home page. The Storage Explorer (`/ping`) uses a flat two-panel Card layout that is visually unstructured. Theme switching (dark/light) is technically supported via CSS variables in `index.css` but not wired to any user-facing control.

This design builds on user feedback from a visual prototype (Variant "Final") and addresses three areas: global navigation, page layout, and theme switching.

## Goals / Non-Goals

**Goals:**
- Establish a persistent global navigation structure (activity bar + top bar) in `__root.tsx`
- Redesign Storage Explorer page with layered layout using shadcn semantic CSS tokens
- Add theme switching (dark/light/system) via `next-themes` with persistence
- Add a Settings page with theme selector
- Rename `/ping` to `/storage` to match the page's purpose

**Non-Goals:**
- No changes to ORPC contracts, routers, or backend business logic
- No changes to existing unit/integration tests (functionality preserved)
- No modifications to CSS variable definitions in `index.css`
- No new features for the storage backends themselves

## Layout Architecture

### Root Layout (`__root.tsx`)

```
┌────┬─────────────────────────────────────────┐
│    │  Top Bar (48px)                         │
│ A  │  [Breadcrumb/Page Title]      [🌙]      │
│ c  ├─────────────────────────────────────────┤
│ t  │                                         │
│ i  │  Page Content (<Outlet />)              │
│ v  │                                         │
│ i  │                                         │
│ t  │                                         │
│ y  │                                         │
│    │                                         │
└────┴─────────────────────────────────────────┘
  48px
```

- **Activity Bar**: `fixed` left sidebar, 48px wide. Contains navigation icons: Home, Storage, Settings. Styled with `bg-muted/30`, `border-border` right border.
- **Top Bar**: Inside the main area, 48px tall. Shows current page title (left) and theme toggle button (right).
- **Page Content**: Flex-fill area rendering `<Outlet />` from TanStack Router.

### Storage Explorer Page

```
┌─────────────────────────────────────────────────────┐
│ Status Cards Row                                     │
│ [Preferences ● 3] [Secrets ● 2] [SQLite ● 5] [Search]│
├────────────────────────┬────────────────────────────┤
│ Inspector (240px)      │ Data Browser (flex-1)       │
│ ───────────            │ ───────────                 │
│ ENGINE                 │ 3 entries                   │
│ Preferences            │                             │
│ electron-store kv      │ #  Key     Value    Actions │
│                        │ 1  theme   dark   [✎][✕]  │
│ ENTRIES                │ 2  lang    en-US  [✎][✕]  │
│ 3                      │ 3  notify  true   [✎][✕]  │
│                        │                             │
│ NEW ENTRY              │                             │
│ [Key] [Value] [+ Add]  │                             │
└────────────────────────┴─────────────────────────────┘
```

- **Status Cards Row**: Horizontal strip showing all 4 storage backends as clickable tabs with item count and status indicator dot. Active tab highlighted with `bg-accent` + ring.
- **Inspector Panel** (left, 240px, `border-r`): Shows engine metadata (type, driver, item count) + new entry form (key/value inputs + add button).
- **Data Browser** (right, flex-1): Entry list with row number, key (mono), value, and hover-reveal action buttons. Empty state centered in the panel.

## Decisions

### 1. Activity Bar vs Inline Links

**Decision**: Use a 48px activity bar (VS Code-style) for global navigation.

**Alternatives considered**:
- **Traditional sidebar (220px+)**: Too much space for only 3 navigation items. The current app has too few pages to justify it.
- **Top tab bar**: Competing with the Storage Explorer's own status cards row.
- **Keep inline links**: No navigation structure; requires going back to home to switch pages.

**Rationale**: The activity bar is compact (48px), scalable (new pages add an icon), and visually separates app-level navigation from page-level content.

### 2. Page Title in Top Bar

**Decision**: Each page owns its title rendering in the top bar area rather than having a centralized breadcrumb system.

**Rationale**: Simpler to implement (no route-to-title mapping), and gives each page flexibility to show additional context in the top bar.

### 3. Theme Switching with next-themes

**Decision**: Use `next-themes` (already in dependencies) with a `ThemeProvider` wrapping the root layout.

**Alternatives considered**:
- **Manual class toggling**: Possible but requires managing `class` on `document.documentElement`, persistence, and system preference detection. `next-themes` handles all of this.
- **CSS-only with `prefers-color-scheme`**: Lacks user override and persistence.

**ThemeProvider integration**: Wrap `<html>` with `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>` in `__root.tsx`. Remove the manual `dark` class from page-level wrappers.

### 4. Semantic Color Tokens

**Decision**: All new and modified components use only shadcn CSS variable tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-accent`, `bg-muted`, etc.).

**Rationale**: This ensures components automatically work in both dark and light mode without any `dark:` overrides. The existing CSS variables in `index.css` already define both themes.

### 5. Route Rename

**Decision**: Rename `/ping` → `/storage` to match the page's label ("Storage Explorer").

**Impact**: Update `routeTree.gen.ts`, route file name, all links pointing to `/ping`, and page component name from `PingPage` to `StorageExplorer` or keep `PingPage` as internal name.

### 6. Settings Page

**Decision**: New `/settings` route with theme selector (light/dark/system buttons) and placeholder for future settings.

**Alternatives considered**:
- **Theme toggle only in top bar**: Covers the basic use case but would be better to have a dedicated settings page as well.
- **Settings as a modal**: More complex; a page is simpler and extensible.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| `next-themes` with Electron: system theme detection may not work correctly in all environments | Default to `dark` as fallback; `enableSystem` is opt-in |
| Route rename breaks existing bookmarks/links | Only internal links exist (home page → ping page); update all references |
| Activity bar uses `fixed` positioning — may conflict with page-level scroll | Activity bar is `h-screen` with `overflow-hidden` parent; page content scrolls independently |
| ThemeProvider requires wrapping the full tree including `<Outlet />` | Wrap in `__root.tsx` route component which is the outermost layer |

## Migration Plan

1. Update `__root.tsx`: Add ThemeProvider + sidebar layout (activity bar + top bar)
2. Create `/settings` route with theme selector
3. Update `index.tsx` (home page): Remove the "Go to Ping Page" link (navigation moves to activity bar)
4. Rename `/ping` → `/storage`: Create new route file, update route tree
5. Update the Storage Explorer `page.tsx` and components with new layout + semantic colors
6. Remove `className="dark"` from individual page wrappers (ThemeProvider handles it)
7. Delete prototype route and files
8. Verify: smoke test, visual verification with theme toggle

## Resolved Decisions (from Review)

- **Theme flash mitigation**: next-themes injects a blocking `<script>` by default that reads localStorage before React hydrates. Accept the built-in behavior.
- **Home page**: Also uses the activity bar layout (not exempt).
- **Settings**: Separate feature module at `src/features/settings/renderer/page.tsx` with dedicated route `/settings`.
- **Route rename**: `/ping` → `/storage`. Only 3 files affected: route file rename, routeTree.gen.ts path updates, and home page link.
- **Go to Ping Page link**: Remove from home page (navigation is now via activity bar).
- **devTool → devtools**: Fixed in index.tsx.
- **Icons**: Use `lucide-react` (the project's icon library via shadcn). Activity bar: `HomeIcon`, `DatabaseIcon`, `Settings2Icon`.
- **Theme persistence**: next-themes uses localStorage by default. Accept this. Future enhancement could sync to electron-store.
- **Settings page location**: New `src/features/settings/` feature module.
