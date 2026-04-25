# Specification: AI Search

## Purpose
Define the requirements and behavior for full-text and vector search using Orama.

## ADDED Requirements

### Requirement: Search Engine Initialization
The system SHALL initialize an Orama search engine.

#### Scenario: Initialize Orama instance
- **WHEN** the application calls `ai.initialize(config)`
- **THEN** an in-memory Orama database is created
- **AND** the configured schema is applied

#### Scenario: Restore from persistence file
- **WHEN** a persistence file exists at the configured path
- **AND** the application initializes Orama
- **THEN** the index is restored from the file
- **AND** search is available immediately

#### Scenario: No persistence file exists
- **WHEN** no persistence file exists
- **AND** the application initializes Orama
- **THEN** an empty index is created
- **AND** rebuild may be needed (documented)

### Requirement: Index Documents
The system SHALL support indexing documents for search.

#### Scenario: Index a single document
- **WHEN** the application calls `ai.insert(document)`
- **THEN** the document is added to the search index

#### Scenario: Index multiple documents
- **WHEN** the application calls `ai.insertMany(documents)`
- **THEN** all documents are added to the index
- **AND** batch processing is used for performance

### Requirement: Full-Text Search
The system SHALL support full-text keyword search.

#### Scenario: Search with term
- **WHEN** the application calls `ai.search({ term: 'query' })`
- **THEN** documents containing the term are returned
- **AND** results are ranked by relevance

#### Scenario: Search with filters
- **WHEN** the application calls `ai.search({ term: 'query', where: {...} })`
- **THEN** only documents matching both term and filters are returned

#### Scenario: Search with pagination
- **WHEN** the application calls `ai.search({ term: 'query', limit: 10, offset: 0 })`
- **THEN** only the specified page of results is returned

### Requirement: Vector Search
The system SHALL support vector similarity search.

#### Scenario: Search with vector
- **WHEN** the application calls `ai.search({ mode: 'vector', vector: [...], property: 'embedding' })`
- **THEN** documents with similar vectors are returned
- **AND** results are ranked by similarity score

#### Scenario: Configure similarity threshold
- **WHEN** the application specifies `similarity: 0.85`
- **THEN** only results with similarity >= 0.85 are returned

### Requirement: Hybrid Search
The system SHALL support combining full-text and vector search.

#### Scenario: Hybrid search
- **WHEN** the application calls `ai.search({ mode: 'hybrid', term: 'query', vector: [...] })`
- **THEN** both full-text and vector results are combined
- **AND** weighted scoring is applied

### Requirement: Document Update and Delete
The system SHALL support updating and removing indexed documents.

#### Scenario: Update indexed document
- **WHEN** the application calls `ai.update(id, document)`
- **THEN** the document in the index is updated

#### Scenario: Remove document from index
- **WHEN** the application calls `ai.remove(id)`
- **THEN** the document is removed from the index

### Requirement: Persistence
The system SHALL support saving and loading the search index.

#### Scenario: Save index to file
- **WHEN** the application calls `ai.save()`
- **THEN** the index is serialized to the configured persistence path

#### Scenario: Configure auto-save
- **WHEN** autoSaveInterval is configured
- **THEN** the index is automatically saved at the specified interval

### Requirement: Schema Definition
The system SHALL require explicit schema definition for indexed documents.

#### Scenario: Define schema with string fields
- **WHEN** the application defines schema with `title: 'string'`
- **AND** indexes a document with title
- **THEN** the field is indexed for text search

#### Scenario: Define schema with vector field
- **WHEN** the application defines schema with `embedding: 'vector[1536]'`
- **AND** indexes a document with embedding array
- **THEN** the field is indexed for vector search
