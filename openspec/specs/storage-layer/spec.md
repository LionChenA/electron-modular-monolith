# Specification: Storage Layer

## Purpose

Define the architecture and integration contract for the unified storage layer that abstracts over four storage backends (preferences, secrets, SQLite, search).

## Requirements

### Requirement: Unified Access via MainContext
The system SHALL expose all storage backends through a single `MainContext` dependency injection container.

#### Scenario: Access preferences from context
- **WHEN** the application accesses `context.preferences`
- **THEN** the preferences module is returned
- **AND** it supports `get`, `set`, and `delete` operations

#### Scenario: Access secrets from context
- **WHEN** the application accesses `context.secrets`
- **THEN** the secrets module is returned
- **AND** it supports `get`, `set`, `delete`, and `isEncryptionAvailable` operations

#### Scenario: Access database from context
- **WHEN** the application accesses `context.database`
- **THEN** the SQLite database module is returned
- **AND** it supports `insert`, `query`, `update`, `delete`, and `transaction` operations

#### Scenario: Access search from context
- **WHEN** the application accesses `context.search`
- **THEN** the Orama search module is returned
- **AND** it supports `initialize`, `insert`, `search`, `update`, `remove`, and `save` operations

### Requirement: ORPC Handler Integration
The system SHALL inject the storage context into ORPC handlers so features can access storage without direct imports.

#### Scenario: Handler receives storage context
- **WHEN** an ORPC handler is invoked
- **THEN** the storage context is available in the handler scope
- **AND** the handler can use `context.preferences`, `context.secrets`, `context.database`, and `context.search`

### Requirement: Storage Backend Separation
The system SHALL keep each storage backend as an independent module with a clear interface.

#### Scenario: Module independence
- **WHEN** a storage module is initialized
- **THEN** it does not depend on other storage modules
- **AND** it can be tested in isolation

### Requirement: Security Best Practices
The system SHALL enforce security best practices for secret storage.

#### Scenario: No plaintext secrets
- **WHEN** storing sensitive data
- **THEN** the application MUST use the secrets module
- **AND** SHALL NOT store plaintext secrets in preferences or SQLite

#### Scenario: Encryption availability warning
- **WHEN** encryption is unavailable on the current platform
- **THEN** the system logs a warning
- **AND** falls back gracefully
