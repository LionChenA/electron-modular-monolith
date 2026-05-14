# Specification: Integration Testing

## Overview

This specification defines the requirements for integration tests using ORPC handlers with direct `call()` invocation.

## Related Specs

- `specs/unit_integration_testing/spec.md`
- `add-storage-layer/specs/sqlite-database/spec.md`
- `add-storage-layer/specs/preferences-storage/spec.md`
- `add-storage-layer/specs/secure-storage/spec.md`
- `add-storage-layer/specs/ai-search/spec.md`
- `specs/communication/spec.md`

## Test Layer Strategy

| Layer | Testing Method | MSW Used? |
|-------|---------------|-----------|
| **Unit** | Direct function calls with mocks | No |
| **Integration** | Direct `call()` to handlers with mocked context | No |
| **Component** | Storybook stories (visual testing) | No |
| **E2E** | Real app (no mocking) | No |

## ADDED Requirements

### Requirement: ORPC Handler Integration Tests

Feature routers SHALL have integration test coverage via direct `call()` invocation with mocked context.

**Why not HTTP + MSW?**
- Integration tests focus on handler business logic, not HTTP transport
- Direct `call()` is faster and more isolated
- MSW is reserved for component tests (Storybook)

#### Scenario: Test sendPing handler
- **WHEN** `call(pingRouter.sendPing, undefined, { context: mockContext })` is invoked
- **THEN** It returns `'pong'`
- **AND** It publishes to the event bus

#### Scenario: Test getPingHistory handler
- **WHEN** `call(pingRouter.getPingHistory, undefined, { context: mockContext })` is invoked
- **THEN** It queries the database and returns ping records

#### Scenario: Test searchPings handler
- **WHEN** `call(pingRouter.searchPings, { term: 'test' }, { context: mockContext })` is invoked
- **THEN** It searches the AI index and returns matching records

### Requirement: Storage Integration Tests

Storage modules SHALL have integration test coverage with real storage.

#### Scenario: SQLite insert and query
- **WHEN** Data is inserted into SQLite
- **AND** The same data is queried
- **THEN** The queried data matches the inserted data

#### Scenario: SQLite update operation
- **WHEN** A record is updated
- **AND** The record is queried again
- **THEN** The updated fields reflect the new values

#### Scenario: SQLite delete operation
- **WHEN** A record is deleted
- **AND** The record is queried
- **THEN** The record is not found

#### Scenario: Orama insert and search
- **WHEN** Documents are inserted into Orama
- **AND** A search query is performed
- **THEN** Relevant documents are returned with correct scores

#### Scenario: Orama update operation
- **WHEN** A document is updated
- **AND** A search is performed
- **THEN** The updated document appears in results

#### Scenario: Orama delete operation
- **WHEN** A document is deleted
- **AND** A search is performed
- **THEN** The deleted document does not appear in results
