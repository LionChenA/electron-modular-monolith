# Tasks: Add Storage Explorer UI

## 0. Prerequisites

- [ ] 0.1 Verify shadcn CLI is v4: `pnpm dlx shadcn@latest --version`
- [ ] 0.2 Verify shadcn skills are installed: check `.agents/skills/shadcn/`

## 1. Install Shadcn Components

Based on new Left/Right split layout design:

- [ ] 1.1 Install tabs component: `pnpm dlx shadcn@latest add tabs`
- [ ] 1.2 Install card component: `pnpm dlx shadcn@latest add card` (already installed)
- [ ] 1.3 Install input component: `pnpm dlx shadcn@latest add input`
- [ ] 1.4 Install button component: `pnpm dlx shadcn@latest add button` (already installed)
- [ ] 1.5 Install badge component: `pnpm dlx shadcn@latest add badge` (already installed)
- [ ] 1.6 Install scroll-area component: `pnpm dlx shadcn@latest add scroll-area`
- [ ] 1.7 Install sonner component: `pnpm dlx shadcn@latest add sonner`
- [ ] 1.8 Install separator component: `pnpm dlx shadcn@latest add separator` (already installed)

## 2. Update Feature Structure (Modify Existing Ping Feature)

Since this is a demo page, we can enhance the existing `ping` feature rather than creating a new one:

- [ ] 2.1 Rename/update `src/features/ping/renderer/page.tsx` to new design
- [ ] 2.2 Keep existing ORPC contracts (they already cover all 4 storage types)
- [ ] 2.3 Update the page layout to Left/Right split

## 3. Create UI Components (Simplified)

New simplified component structure based on left/right split:

- [ ] 3.1 Update existing page to use Tabs layout
- [ ] 3.2 Create ActionPanel component (left side - form inputs + buttons)
- [ ] 3.3 Create DataList component (right side - data display)
- [ ] 3.4 Create EmptyState component
- [ ] 3.5 Create SecretCell component (masked display with reveal)
- [ ] 3.6 Integrate Sonner for toast notifications

## 4. Implement ORPC Procedures (Already Done)

The ping feature already has all required procedures:

- [ ] 4.1 getAllPreferences / setPreference / deletePreference
- [ ] 4.2 listApiKeys / storeApiKey / deleteApiKey
- [ ] 4.3 getPingHistory / savePingToDb / deletePing
- [ ] 4.4 searchPings (Orama full-text search)

## 5. Implement New Features

- [ ] 5.1 Add delete preference procedure
- [ ] 5.2 Add delete API key procedure
- [ ] 5.3 Add delete ping procedure

## 6. Integration

- [ ] 6.1 Connect Tabs to switch between storage types
- [ ] 6.2 Connect ActionPanel to ORPC mutations
- [ ] 6.3 Connect DataList to ORPC queries with TanStack Query
- [ ] 6.4 Add toast notifications for all operations
- [ ] 6.5 Implement Search tab with Orama integration

## 7. Edge Cases

- [ ] 7.1 Handle empty states for each storage type
- [ ] 7.2 Handle long values (truncation)
- [ ] 7.3 Handle loading states with Skeleton
- [ ] 7.4 Handle error states

## 8. Testing

- [ ] 8.1 Manual testing in dev mode
- [ ] 8.2 Verify CRUD operations work for all 4 storage types
- [ ] 8.3 Verify search returns results with scores

## 9. Verification

- [ ] 9.1 Run `pnpm build` - verify build passes
- [ ] 9.2 Run `pnpm check` - verify lint passes
- [ ] 9.3 Run `pnpm typecheck` - verify types pass
- [ ] 9.4 Manual testing: add/edit/delete preferences
- [ ] 9.5 Manual testing: add/edit/delete secrets
- [ ] 9.6 Manual testing: add/delete ping records
- [ ] 9.7 Manual testing: search with Orama
