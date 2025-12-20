---
title: Context7 Integration Process
status: living-document
tags: [process, context7, knowledge-management]
---

# Context7 Integration Process

## Purpose

This specification defines a standardized process for integrating information obtained via Context7 into the project's knowledge base. It ensures that insights from external documentation are systematically researched, validated, and transformed into high-quality, project-specific knowledge artifacts (`openspec/docs/*.md`) that adhere to the `meta-specification-framework`'s standards. This process is crucial for efficiently adopting new, complex, or less commonly used technologies, especially when traditional LLM knowledge is insufficient.

## Requirements

### Requirement: Trigger Conditions for Context7 Integration

The Context7 Integration process MUST be initiated when encountering difficult problems during development that require external information, prioritizing Context7 over websearch, webfetch, or other tools.

#### Scenario: Development Troubleshooting

- **GIVEN** encountering persistent and difficult-to-resolve technical problems during development
- **WHEN** internal knowledge sources and standard debugging are insufficient
- **THEN** Context7 MUST be prioritized as the first external information source (NOT websearch or webfetch)

**Examples of qualifying problems:**
- Persistent type errors that cannot be resolved through standard debugging
- Complex configuration issues with build tools or libraries
- Deep architectural questions requiring external expertise
- Integration problems between multiple technologies

#### Scenario: User Explicit Request for Research

- **GIVEN** a user explicitly requests research on a specific technology or problem
- **WHEN** such a request is made
- **THEN** Context7 MUST be the preferred tool for information gathering

#### Scenario: Document Creation Decision

- **GIVEN** a Context7 integration is performed
- **WHEN** the user requests knowledge artifact creation
- **THEN** two types of artifacts are available:
  1. **Core Dependency**: Full 6-part structure (Overview → API → Features → Application → Common Issues)
  2. **Specific Problem**: Problem-focused documentation using simplified template

### Requirement: Context7 Integration Workflow

The Context7 Integration process MUST follow a defined workflow with Context7 as the primary external information source.

#### Scenario: Execution of Research and Analysis

- **GIVEN** the Context7 Integration process has been triggered for a specific technology or problem.
- **WHEN** executing the workflow.
- **THEN** the following steps MUST be performed:
  1.  **Tool Priority**: Use Context7 as the FIRST external information source (NOT websearch, webfetch, or other tools)
  2.  **Formulate Query**: Construct precise queries for Context7 to target relevant external documentation.
  3.  **Information Gathering**: Systematically collect and synthesize information from Context7, focusing on core concepts, usage patterns, and known issues.
  4.  **Project-Specific Analysis**: Analyze the gathered information specifically through the lens of the current project's architecture, conventions, and existing codebase.
  5.  **Problem-Solving & Validation**: Apply the insights to resolve the specific problem (e.g., fix type errors, integrate new features), and thoroughly validate the solution's effectiveness and stability.

#### Scenario: When Context7 is Insufficient

- **GIVEN** Context7 has been used but still lacks sufficient information
- **WHEN** additional external research is needed
- **THEN** other tools (websearch, webfetch) MAY be used as supplementary sources

#### Scenario: Creation of Knowledge Artifact

- **GIVEN** the research, analysis, and validation steps are complete.
- **WHEN** creating the knowledge artifact.
- **THEN** a new Markdown file (`openspec/docs/*.md`) MUST be created in the `openspec/docs/` directory.
- **AND** this artifact MUST strictly adhere to the **`Standard for Knowledge Artifacts`** defined in the `meta-specification-framework` (including YAML Front Matter, specific section titles, and content requirements).
- **AND** the artifact MUST capture the `Context7 ID` in its front matter and follow the 6-part structure: `Overview`, `API`, `Features`, `Application`, and `Common Issues`, ensuring clear API → Features → Application dependency chain.

#### Scenario: Integration into Project Practices

- **GIVEN** a knowledge artifact has been created and validated.
- **WHEN** integrating the new knowledge into project practices.
- **THEN** the insights and best practices documented in the artifact MUST be considered for updates to relevant `specs/*.md` files, architectural guidelines, or coding conventions.

### Requirement: Conformance to Meta-Specification Framework

All outputs and processes within Context7 Integration MUST comply with the rules established in the `meta-specification-framework`.

> [!NOTE]
> All path references in this specification have been updated to use the new `openspec/docs/` directory structure.

#### Scenario: Documentation Output Conformance

- **GIVEN** a knowledge artifact (`openspec/docs/*.md`) produced by the Context7 Integration process.
- **WHEN** validating its format and content.
- **THEN** it MUST fully comply with all requirements specified in the `meta-specification-framework`, including YAML Front Matter, standardized headers, and metadata comments.
