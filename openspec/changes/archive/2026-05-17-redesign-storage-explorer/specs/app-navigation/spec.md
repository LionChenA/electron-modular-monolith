# Specification: App Navigation

## Purpose

Define the requirements for a persistent global navigation structure across the application. Currently pages are only accessible via inline links on the home page. This spec introduces a sidebar activity bar as the primary navigation mechanism.

## Requirements

### Requirement: Activity Bar

The application SHALL display a persistent 48px activity bar on the left edge of the window.

#### Scenario: Activity bar is always visible
- **WHEN** any page is displayed
- **THEN** the activity bar is visible on the left side of the window
- **AND** it contains icons for all navigable pages

#### Scenario: Navigate between pages
- **WHEN** the user clicks an activity bar icon
- **THEN** the application navigates to the corresponding page
- **AND** the active page's icon is visually highlighted (accent background)

### Requirement: Top Bar

The application SHALL display a persistent top bar with the current page title and global actions.

#### Scenario: Top bar shows page title
- **WHEN** the user navigates to a page
- **THEN** the top bar displays the page title matching the current route

#### Scenario: Theme toggle in top bar
- **WHEN** any page is displayed
- **THEN** the theme toggle button is visible in the top bar

### Requirement: Available Pages

The activity bar SHALL provide navigation to the following pages:

| Icon | Page | Route | Description |
|------|------|-------|-------------|
| Home (HardDrive) | Home | `/` | Landing page with app overview |
| Storage (Database) | Storage Explorer | `/storage` | Storage backend CRUD interface |
| Settings (Settings) | Settings | `/settings` | Application settings and preferences |

### Requirement: Route Layout

All pages SHALL render within the root layout (activity bar + top bar).

#### Scenario: Page renders in layout
- **WHEN** a route is active
- **THEN** the page content is rendered between the top bar and the bottom of the window
- **AND** the page content scrolls independently of the activity bar

### Requirement: Future Extensibility

The navigation system SHALL support adding new pages without restructuring the layout.

#### Scenario: Add new page
- **WHEN** a new page route is created
- **THEN** adding it to the activity bar requires only adding a new navigation item with an icon and route path
