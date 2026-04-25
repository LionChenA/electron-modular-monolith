# Specification: SQLite Database

## Purpose
Define the requirements and behavior for structured data storage using SQLite.

## ADDED Requirements

### Requirement: Database Initialization
The system SHALL initialize a SQLite database with configurable adapter.

#### Scenario: Initialize with better-sqlite3
- **WHEN** the application initializes with adapter 'better-sqlite3'
- **THEN** a native SQLite database connection is created
- **AND** WAL mode is enabled for performance

#### Scenario: Initialize with sql.js
- **WHEN** the application initializes with adapter 'sql.js'
- **THEN** a WebAssembly-based SQLite database is created
- **AND** runs entirely in JavaScript

### Requirement: Basic CRUD Operations
The system SHALL support basic Create, Read, Update, Delete operations.

#### Scenario: Insert a row
- **WHEN** the application calls `db.insert(table, data)`
- **THEN** a new row is created in the specified table
- **AND** returns the row ID

#### Scenario: Query rows
- **WHEN** the application calls `db.query(sql, params)`
- **THEN** the SQL is executed with parameters
- **AND** results are returned as typed objects

#### Scenario: Update rows
- **WHEN** the application calls `db.update(table, data, where)`
- **THEN** matching rows are updated
- **AND** returns the number of affected rows

#### Scenario: Delete rows
- **WHEN** the application calls `db.delete(table, where)`
- **THEN** matching rows are deleted
- **AND** returns the number of affected rows

### Requirement: Transaction Support
The system SHALL support database transactions.

#### Scenario: Execute in transaction
- **WHEN** the application calls `db.transaction(fn)`
- **AND** the function executes multiple operations
- **THEN** all operations succeed or all are rolled back

### Requirement: Type Safety
The system SHALL provide TypeScript type safety for queries.

#### Scenario: Typed query result
- **WHEN** the application uses typed query methods
- **THEN** results are properly typed
- **AND** TypeScript catches type mismatches at compile time

### Requirement: Prepared Statements
The system SHALL support prepared statements for performance and security.

#### Scenario: Use prepared statement
- **WHEN** the application prepares a statement with placeholders
- **AND** executes with parameter binding
- **THEN** SQL injection is prevented

### Requirement: Database File Location
The system SHALL store database files in a configurable location.

#### Scenario: Configure database path
- **WHEN** the application provides a custom database path
- **THEN** the database file is created at that location
- **AND** persists across application restarts
