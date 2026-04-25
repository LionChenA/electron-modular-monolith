# Proposal: Add Storage Explorer UI

## Why

The current Ping page has 4 cards (Preferences, Secrets, SQLite, Orama) that each mix:
- Data display
- Input fields  
- Action buttons

This design is confusing and not intuitive. Additionally, this page serves as a demonstration of our infrastructure capabilities. The current design doesn't clearly showcase the 4 different storage types.

## What Changes

### New Design: Left/Right Split Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Tabs: [Preferences] [Secrets] [SQLite] [Search]         │
├──────────────────────┬────────────────────────────────────┤
│  Action Panel (35%) │  Data List (65%)                   │
│  - Input fields     │  - Real-time data display          │
│  - Add/Delete       │  - Edit/Delete buttons per row     │
│  - Toast feedback   │  - Empty state handling            │
└──────────────────────┴────────────────────────────────────┘
```

### Install New Shadcn Components (Simplified)
- `tabs` - For switching between storage types
- `scroll-area` - For scrollable data lists
- `sonner` - For toast notifications

Note: Reuses existing components (card, button, badge, input, separator)

### Component Changes
- **Modify existing**: `src/features/ping/renderer/page.tsx` with new left/right split layout
- **No new feature directory**: Reuses existing ping feature structure
- **Simplified components**: ActionPanel + DataList instead of complex Table + Dialog

## Capabilities

### Storage-Specific Behaviors

| Tab | Data Source | Operations | Special Features |
|-----|-------------|------------|------------------|
| **Preferences** | electron-store | Add, Edit, Delete | Plain key-value |
| **Secrets** | SafeStorage | Add, Edit, Delete | Masked by default, reveal button |
| **SQLite** | better-sqlite3 | Add, Delete | Display ping history |
| **Search** | Orama | Search | Relevance scores display |

### Demo Principles
1. **Immediate feedback**: Every operation shows toast notification
2. **Data visibility**: Users can always see current storage state
3. **Clear attribution**: Footer shows backend for each storage type

## Impact

### Code Changes
- **Modified files**: `src/features/ping/renderer/page.tsx`
- **New dependencies**: 2-3 shadcn components (tabs, scroll-area, sonner)

### Breaking Changes
- **None** - Existing ping feature remains functional

### Integration Points
- Uses existing ORPC procedures from ping feature
- Integrates with existing storage infrastructure (preferences, secrets, sqlite, orama)
- Uses TanStack Query for data fetching

## Acceptance Criteria

1. ✅ 4 tabs switch correctly between storage types
2. ✅ Left/right split layout clearly shows operations vs data
3. ✅ Add creates new records and updates data list immediately
4. ✅ Edit populates form for modification
5. ✅ Delete removes records with confirmation
6. ✅ Search tab demonstrates Orama full-text search with scores
7. ✅ Toast notifications show success/failure for all operations
8. ✅ Secrets show masked by default with reveal button
9. ✅ Empty states handled gracefully
10. ✅ Long values truncated properly

## Testing
- Manual testing in dev mode
- Verify CRUD operations for all 4 storage types
- Verify search returns results with relevance scores
