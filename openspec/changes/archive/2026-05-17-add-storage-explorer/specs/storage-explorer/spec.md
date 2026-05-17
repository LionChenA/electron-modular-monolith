# Specification: Storage Explorer UI

## Purpose

Define requirements for the Storage Explorer UI that demonstrates 4 storage types.

## ADDED Requirements

### Requirement: Tab Navigation

The system SHALL provide tab-based navigation between storage types.

#### Scenario: Switch between tabs
- **WHEN** user clicks a tab (Preferences/Secrets/SQLite/Search)
- **THEN** the view updates to show that storage type's data

### Requirement: Left/Right Split Layout

The UI SHALL use a split panel layout.

#### Scenario: Panel proportions
- **GIVEN** screen width >= 1024px
- **WHEN** page loads
- **THEN** Action Panel is 35% and Data List is 65%

### Requirement: Action Panel

The left panel SHALL provide CRUD operations.

#### Scenario: Add new record
- **WHEN** user enters Key and Value
- **AND** clicks Add button
- **THEN** record is created via ORPC
- **AND** Data List updates immediately

#### Scenario: Delete record
- **WHEN** user clicks delete on a row
- **THEN** record is deleted
- **AND** Toast shows success

### Requirement: Data List

The right panel SHALL display storage data.

#### Scenario: Show preferences
- **GIVEN** Preferences tab is active
- **WHEN** data loads
- **THEN** shows key-value pairs

#### Scenario: Show secrets
- **GIVEN** Secrets tab is active
- **WHEN** data loads
- **THEN** values are masked (••••••)

#### Scenario: Show SQLite data
- **GIVEN** SQLite tab is active
- **WHEN** data loads
- **THEN** shows ping history records

### Requirement: Search Tab (Orama)

The Search tab SHALL demonstrate full-text search.

#### Scenario: Search with results
- **WHEN** user enters search term
- **AND** clicks Search
- **THEN** results show with relevance scores

### Requirement: Toast Notifications

The UI SHALL show success/error feedback.

#### Scenario: Operation success
- **WHEN** CRUD operation succeeds
- **THEN** Toast shows success message

### Requirement: Empty States

The UI SHALL handle empty data gracefully.

#### Scenario: No data
- **GIVEN** storage is empty
- **WHEN** tab is selected
- **THEN** shows "No data" message with Add CTA
