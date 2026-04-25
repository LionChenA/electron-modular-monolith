# Specification: Preferences Storage

## Purpose
Define the requirements and behavior for user preferences and configuration storage.

## ADDED Requirements

### Requirement: Basic Key-Value Storage
The system SHALL provide basic key-value storage for user preferences.

#### Scenario: Set a preference value
- **WHEN** the application calls `prefs.set(key, value)`
- **THEN** the value is persisted to disk immediately
- **AND** the value can be retrieved with `prefs.get(key)`

#### Scenario: Get a preference value
- **WHEN** the application calls `prefs.get(key)` with an existing key
- **THEN** the stored value is returned

#### Scenario: Get a preference value with default
- **WHEN** the application calls `prefs.get(key, defaultValue)` with a non-existing key
- **THEN** the defaultValue is returned
- **AND** the defaultValue is NOT persisted

#### Scenario: Delete a preference
- **WHEN** the application calls `prefs.delete(key)`
- **THEN** the key is removed from storage
- **AND** subsequent `get` calls return undefined

### Requirement: Nested Property Access
The system SHALL support dot-notation for nested preference properties.

#### Scenario: Set nested property
- **WHEN** the application calls `prefs.set('theme.colors.primary', '#ff0000')`
- **THEN** the nested structure `{ theme: { colors: { primary: '#ff0000' } } }` is stored

#### Scenario: Get nested property
- **WHEN** the application calls `prefs.get('theme.colors.primary')`
- **THEN** the value `#ff0000` is returned

### Requirement: Schema Validation
The system SHALL support JSON Schema validation for preference values.

#### Scenario: Set value that violates schema
- **WHEN** the application sets a preference with a value that violates the schema
- **THEN** an error is thrown with schema violation details

#### Scenario: Set value that passes schema
- **WHEN** the application sets a preference with a valid value
- **AND** a schema is defined for that key
- **THEN** the value is accepted and stored

### Requirement: Default Values
The system SHALL support default values for preferences.

#### Scenario: Access undefined key with default
- **WHEN** the application defines defaults in schema
- **AND** accesses a non-existent key
- **THEN** the default value is returned

### Requirement: Type Safety
The system SHALL provide TypeScript type safety for preferences.

#### Scenario: Type-safe get
- **WHEN** the application uses `prefs.get<T>(key)` with TypeScript
- **THEN** the return value is typed as `T | undefined`
