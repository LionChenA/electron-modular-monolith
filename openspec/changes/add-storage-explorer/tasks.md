# Tasks: Add Storage Explorer UI

## 0. Prerequisites

- [x] 0.1 Verify shadcn CLI is v4: verified local shadcn@4.7.0
- [x] 0.2 Verify shadcn skills are installed: reinstalled from official source

## 1. Install Shadcn Components

Based on new Left/Right split layout design:

- [x] 1.1 Install tabs component: `pnpm shadcn add tabs`
- [x] 1.2 Install card component: `pnpm shadcn add card` (already installed)
- [x] 1.3 Install input component: `pnpm shadcn add input`
- [x] 1.4 Install button component: `pnpm shadcn add button` (already installed)
- [x] 1.5 Install badge component: `pnpm shadcn add badge` (already installed)
- [x] 1.6 Install scroll-area component: `pnpm shadcn add scroll-area`
- [x] 1.7 Install sonner component: `pnpm shadcn add sonner`
- [x] 1.8 Install separator component: `pnpm shadcn add separator` (already installed)

## 2. Update Feature Structure (Modify Existing Ping Feature)

Since this is a demo page, we can enhance the existing `ping` feature rather than creating a new one:

- [x] 2.1 Update `src/features/ping/renderer/page.tsx` to tabbed left/right split layout
- [x] 2.2 Keep existing ORPC contracts (they already cover all 4 storage types)
- [x] 2.3 Update the page layout to Left/Right split

## 3. Create UI Components (Simplified)

New simplified component structure based on left/right split:

- [x] 3.1 Update existing page to use Tabs layout
- [x] 3.2 Create ActionPanel component (left side - form inputs + buttons)
- [x] 3.3 Create DataList component (right side - data display)
- [x] 3.4 Create EmptyState component
- [x] 3.5 Create SecretCell component (masked display with reveal)
- [x] 3.6 Integrate Sonner for toast notifications

## 4. ORPC Procedures

The existing ORPC contract and router already include all CRUD operations:

- [x] 4.1 getAllPreferences / setPreference / deletePreference
- [x] 4.2 listApiKeys / storeApiKey / deleteApiKey
- [x] 4.3 getPingHistory / savePingToDb / deletePing
- [x] 4.4 searchPings (Orama full-text search)

## 5. Delete Procedures (Backend)

Added delete endpoints to ORPC contract and router:

- [x] 5.1 Add delete preference procedure
- [x] 5.2 Add delete API key procedure
- [x] 5.3 Add delete ping procedure

## 6. Integration

- [x] 6.1 Connect Tabs to switch between storage types
- [x] 6.2 Connect ActionPanel to ORPC mutations (setPref/storeKey/savePing with toast)
- [x] 6.3 Connect DataList to ORPC queries with TanStack Query (getAllPreferences/listApiKeys/getPingHistory)
- [x] 6.4 Add toast notifications for all operations (sonner success/error)
- [x] 6.5 Implement Search tab with Orama integration (searchPings query with term, enabled/disabled state)

## 7. Edge Cases

- [x] 7.1 Handle empty states for each storage type (EmptyState component)
- [x] 7.2 Handle long values (truncate CSS on DataList value span)
- [x] 7.3 Handle loading states (Loading... message when query is fetching)
- [x] 7.4 Handle error states (toast on mutation error, error message in DataList empty state)

## 8. Testing

- [x] 8.1 Manual testing in dev mode (agent-browser snapshot + screenshot verified)
- [ ] 8.2 Manual CRUD verification (requires user-interactive testing)
- [ ] 8.3 Manual search verification (requires indexed data)

## 9. Verification

- [x] 9.1 Run `pnpm build` - verify build passes (304ms)
- [x] 9.2 Run `pnpm check` - verify lint passes (pre-existing warnings only)
- [x] 9.3 Run `pnpm typecheck` - verify types pass (clean)
- [ ] 9.4 Manual testing: add/edit/delete preferences
- [ ] 9.5 Manual testing: add/edit/delete secrets
- [ ] 9.6 Manual testing: add/delete ping records
- [ ] 9.7 Manual testing: search with Orama
