---
title: Meta-Specification Framework
status: living-document
tags: [governance, specification, documentation]
---

# Meta-Specification Framework

## Purpose

This document defines the overarching rules, structure, and format for all specifications (L0, L1, L2) and knowledge artifacts (`openspec/docs/*`) within this project. Its goal is to ensure consistency, clarity, and machine-parsability across all documentation, thereby enhancing maintainability, knowledge transfer, and automation capabilities.

## Requirements

### Requirement: Document Structure and Format Standards (V5)

All Markdown-based documentation and specification files within this project MUST adhere to a multi-layered formatting standard to ensure clarity, consistency, and parsability by both humans and machines.

#### Scenario: File-Level Metadata

- **GIVEN** a specification or knowledge artifact file.
- **WHEN** metadata describing the entire file (e.g., title, status, author, tags, `context7-id`) is needed.
- **THEN** this metadata MUST be defined using **YAML Front Matter** at the very top of the file, enclosed by `---` delimiters.

**Example:**

```yaml
---
title: My Document Title
status: living-document
author: John Doe
tags: [tag1, tag2]
context7-id: /org/project/v1.0
---
```

#### Scenario: Human-Readable Document Sections

- **GIVEN** a need to structure the document content into clear, human-readable sections.
- **WHEN** defining major document divisions.
- **THEN** these divisions MUST be marked using **Standard Markdown Headers** (`#`, `##`, `###`, etc.).
- **AND** the `meta-specification-framework` itself MUST define a consistent set of required section titles for specific document types (e.g., all `openspec/docs/*.md` files must follow the 6-part structure: Overview, API, Features, Application, Common Issues).

**Example:**

```markdown
# Document Title

## Section One

### Subsection A
```

#### Scenario: Human-Readable Callouts and Admonitions

- **GIVEN** a need to highlight important notes, tips, warnings, or other specific information for human readers within the document flow.
- **WHEN** creating such callouts.
- **THEN** **GitHub Flavored Markdown (GFM) Admonitions** MUST be used.

**Example:**

```markdown
> [!NOTE]
> This is an important note for the reader.

> [!WARNING]
> Be cautious with this procedure.
```

#### Scenario: Machine-Readable Metadata Blocks

- **GIVEN** a need to embed invisible, machine-parsable metadata pertaining to a specific block, section, or prompt part.
- **WHEN** adding such block-level metadata.
- **THEN** this metadata MUST be enclosed within **HTML Comment blocks (`<!-- ... -->`)** placed immediately preceding the content they describe.
- **AND** the content within the comment MUST use a YAML-like key-value pair format or a simple `key: value` structure.

**Example:**

```markdown
<!--
meta:
  type: troubleshooting-tip
  severity: critical
  summary: "Client type import error"
-->

### Problem: Client Type Import

The primary mistake...
```

#### Scenario: Machine-Readable Content Delimitation (XML Tags)

- **GIVEN** a need to clearly delimit different logical parts of a complex prompt, context, or structured data directly within the document body for optimal LLM parsing.
- **WHEN** constructing such delimited content.
- **THEN** **XML-like tags** (`<context>`, `<instructions>`, `<example>`) MUST be used to define these logical blocks.

**Example:**

```markdown
<instructions>
You are an expert software engineer.
</instructions>

<context>
The user is working on an Electron application.
</context>
```

### Requirement: Standard for Knowledge Artifacts (`openspec/docs/*.md`)

All knowledge artifacts located in the `openspec/docs/` directory MUST adhere to a specific structure and content requirements, as enforced by the `Context7 Integration` process.

#### Scenario: Knowledge Artifact Content Requirements

- **GIVEN** a new knowledge artifact is being created (e.g., as a result of the `Context7 Integration` process).
- **WHEN** writing the content for this artifact.
- **THEN** it MUST adhere to a structured 6-part format:
  1. **`Overview`** section summarizing the technology/pattern.
  2. **`API`** section listing all specific APIs, grouped by NPM package (Core API + Advanced Features API).
  3. **`Features`** section describing how APIs combine into architectural features (API → Features dependency).
  4. **`Application`** section showing how features are implemented in our project (Features → Application dependency).
  5. **`Common Issues`** section documenting actual problems and solutions encountered.
  6. File-level metadata MUST include `context7-id`.

**Example:**

Refer to the standard template at `openspec/docs/_template.md` for the complete 6-part structure and formatting requirements.

> [!NOTE]
> This 6-part structure (Overview → API → Features → Application → Common Issues) ensures a clear dependency chain from low-level building blocks to project-specific implementation.
