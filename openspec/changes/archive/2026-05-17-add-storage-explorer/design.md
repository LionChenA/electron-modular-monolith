# Design: Storage Explorer UI

## Context

This design builds upon the existing storage infrastructure (electron-store, SafeStorage, SQLite, Orama) and creates a unified UI for exploring and demonstrating 4 storage types as a demo page.

**Design Principle**: Keep it minimal but intuitive — users should immediately see that their CRUD operations actually affect the underlying storage.

## UI/UX Specification

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Header: "Storage Explorer"                                 [Theme]  │
├─────────────────────────────────────────────────────────────────────────┤
│  Tabs: [Preferences] [Secrets] [SQLite] [Search]                       │
├───────────────────────────────┬───────────────────────────────────────┤
│  Action Panel (35%)           │  Data List (65%)                     │
│  ┌───────────────────────────┐│  ┌─────────────────────────────────┐  │
│  │ Key:                      ││  │ • theme: dark          [Edit]   │  │
│  │ [________________________]││  │ • lang: zh-CN         [Edit]   │  │
│  │                           ││  │ • api_key: *****    [Reveal]   │  │
│  │ Value:                    ││  │                               │  │
│  │ [________________________]││  └─────────────────────────────────┘  │
│  │                           ││                                       │
│  │ [  Add  ] [  Delete  ]   ││  (ScrollArea for long lists)         │
│  └───────────────────────────┘│                                       │
│                               │  [Empty state: "No data - click Add"] │
│  [Toast notification area]    │                                       │
│                               │                                       │
├───────────────────────────────┴───────────────────────────────────────┤
│  Footer: "Powered by electron-store • SafeStorage • SQLite • Orama"   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Search Tab (Orama)

```
┌───────────────────────────────┬───────────────────────────────────────┤
│  Search Panel (35%)            │  Search Results (65%)                │
│  ┌───────────────────────────┐│  ┌─────────────────────────────────┐  │
│  │ 🔍 Search indexed data...  ││  │ ping-123 (score: 0.95)        │  │
│  │                           ││  │ "ping message here..."          │  │
│  │ [Search]                  ││  ├─────────────────────────────────┤  │
│  │                           ││  │ ping-122 (score: 0.82)        │  │
│  │ Search Info:              ││  │ "another ping..."              │  │
│  │ - Enter keywords to       ││  └─────────────────────────────────┘  │
│  │   search indexed data     ││                                       │
│  │ - Shows relevance scores  ││                                       │
│  │ - Click result to view    ││                                       │
│  └───────────────────────────┘│                                       │
└───────────────────────────────┴───────────────────────────────────────┘
```

**SQLite Tab Content**:
- Displays ping history records with fields: `id`, `message`, `timestamp`, `count`
- Shows most recent records first (descending by timestamp)
┌─────────────────────────────────┬───────────────────────────────────────┤
│  搜索面板 (35%)                  │  搜索结果 (65%)                        │
│  ┌───────────────────────────┐  │  ┌─────────────────────────────────┐ │
│  │ 🔍 Search indexed data...  │  │  │ ping-123 (score: 0.95)        │ │
│  │                           │  │  │ "ping message here..."          │ │
│  │ [Search]                  │  │  ├─────────────────────────────────┤ │
│  │                           │  │  │ ping-122 (score: 0.82)        │ │
│  │ 搜索说明:                  │  │  │ "another ping..."              │ │
│  │ - 输入关键词搜索            │  │  └─────────────────────────────────┘ │
│  │ - 显示相关性分数            │  │                                       │
│  │ - 点击查看详情              │  │                                       │
│  └───────────────────────────┘  │                                       │
└─────────────────────────────────┴───────────────────────────────────────┘
```

## Visual Design

**Color Palette** (Dark Theme):
- Background: `bg-background` (#0a0a0a)
- Card: `bg-card` (#1c1c1c)
- Border: `border-border` (#27272a)
- Primary: `text-primary` (#fafafa)
- Muted: `text-muted-foreground` (#a1a1aa)
- Accent: `text-accent-foreground` (#0891b2) (cyan-600)

**Spacing**:
- Container padding: 24px
- Card padding: 16px
- Gap between elements: 12px
- Panel split: 35% / 65%

**Typography**:
- Font: System sans-serif
- Heading: 24px bold
- Subheading: 14px regular
- Table: 14px regular
- Badge: 12px medium

## Components

### 1. StorageTabs

Based on shadcn `Tabs`:
- 4 tabs: Preferences, Secrets, SQLite, Search (Orama)
- Each tab has an icon (Settings, Key, Database, Search)
- Active state: underline + bold text

### 2. ActionPanel (Left)

Based on shadcn `Card`:
- Input fields for Key/Value
- Add and Delete buttons
- Collapses to minimal view when not needed

### 3. DataList (Right)

Based on shadcn `Table` or `Card` list:
- Shows current storage data
- Each row has: data, edit button, delete button
- Click row → populates ActionPanel for editing

### 4. Toast Notifications

Based on shadcn `Sonner`:
- Shows success/error feedback after each operation
- Examples: "Preference saved", "Key deleted", "Search complete"

### 5. ScrollArea

Based on shadcn `ScrollArea`:
- Wraps long data lists
- Custom scrollbar styling

### 6. EmptyState

Custom component:
- Shows when no data exists
- "No data yet" message with Add button CTA

### 7. SecretCell (Custom)

Special cell for Secrets tab:
- Default: Show `••••••••`
- Click reveal button: Show for 3 seconds
- Copy button always visible

## Interactions

### Tab Switch
1. User clicks tab
2. ActionPanel and DataList update to reflect selected storage type
3. Previous state clears

### Add Operation
1. User enters Key and Value
2. Clicks "Add"
3. ORPC mutation executes
4. Toast shows success/failure
5. DataList automatically refreshes (TanStack Query)
6. User sees data appears in list immediately

### Edit Operation
1. User clicks edit button on a row
2. ActionPanel populates with existing Key/Value
3. User modifies and clicks "Add" (updates)
4. Toast shows success
5. DataList reflects changes

### Delete Operation
1. User clicks delete button on a row
2. Confirmation via Dialog or direct delete
3. Toast shows "Deleted"
4. DataList removes the item

### Search (Orama Tab)
1. User enters search term
2. Results show with relevance scores
3. Click result to view details

## Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ StorageTabs │────▶│ useStorage   │────▶│  ORPC       │
│ (user      │     │ (hook)       │     │  Procedures │
│  selection)│     └──────────────┘     └──────┬──────┘
│                                            │
┌─────────────┐     ┌──────────────┐          │
│ ActionPanel │◀────│ useMutation  │◀─────────┘
│ (form)      │     │ (TanStack)   │
└─────────────┘     └──────────────┘

┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│ DataList    │◀────│ useQuery     │◀────│  ORPC       │
│ (display)   │     │ (TanStack)   │     │  Queries    │
└─────────────┘     └──────────────┘     └─────────────┘
```

## State Management

### Local State (Component)
- `selectedTab`: Current storage type
- `formKey`: Key input value
- `formValue`: Value input value

### Server State (TanStack Query)
- `data`: Current storage data
- `isLoading`: Loading state
- `error`: Error state

## Edge Cases

| Edge Case | Handling |
|-----------|----------|
| **Empty state** | Show "No data" message + Add button CTA |
| **Long values** | Truncate with ellipsis, full in Dialog if needed |
| **Many items** | Use ScrollArea, consider pagination for 1000+ items |
| **Special characters** | Sanitize display, use monospace for keys |
| **Binary/JSON values** | Detect type, show "View" button to open Dialog |
| **Network error** | Toast shows error, data remains cached |
| **Search no results** | Show "No matches found" message |

## Acceptance Criteria

1. ✅ 4 tabs switch correctly between storage types (Preferences, Secrets, SQLite, Search)
2. ✅ ActionPanel + DataList layout clearly shows CRUD operations
3. ✅ Add button creates new records and updates DataList immediately
4. ✅ Edit via row button populates form for modification
5. ✅ Delete button removes records with feedback
6. ✅ Search tab demonstrates Orama full-text search with relevance scores
7. ✅ Toast notifications show success/failure for all operations
8. ✅ Secrets show masked by default, reveal button works
9. ✅ Empty states handled gracefully
10. ✅ Long values truncated with proper handling
11. ✅ Responsive layout works at 1024px+
12. ✅ Dark theme consistent with app

## Key Demo Principles

1. **Immediate feedback**: Every operation shows instant visual confirmation
2. **Data visibility**: Users can always see the current state of storage
3. **Clear attribution**: Footer shows which backend powers each storage type
4. **Live updates**: TanStack Query ensures data is always fresh
