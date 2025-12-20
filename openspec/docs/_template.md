---
# The title of the document.
title: "Usage of [Technology] in project"
# A list of relevant tags.
tags: [tag1, tag2]

# List of official Context7 documentation IDs used as primary sources.
sources:
  - id: "[Context7 ID]"

# List of NPM packages from this ecosystem that are USED in our project.
packages:
  - id: "[npm name]"
    description: "A concise description of the package's role in this project (less than 20 words)."

# List of other NPM packages from this ecosystem discovered but NOT used.
related_packages:
  - id: "[npm name]"
    description: "A concise description of the package (less than 20 words)."

# List of other web links (e.g., GitHub issues, articles) used for research.
links:
  - url: "[URL]"
    description: "A brief summary of the linked page."
---

# Guide: [Technology/Concept Name]

> [!NOTE]
> This document is the project's "compressed cache" of knowledge for **[Technology/Concept Name]**.

<!-- @gemini:summary:start -->

A brief, one-sentence summary of this technology's role in our project.

<!-- @gemini:summary:end -->

## 1. Overview

A high-level summary of what this technology is and its purpose within _our project_.

## 2. API

This section lists all specific APIs imported from the ecosystem, grouped by their source NPM package.

### 2.1. Core API

#### `@some-package/name`

- `functionOne` - Description of what this function does
- `TypeTwo` - Description of this type and its usage

#### `@some-package/another`

- `functionThree` - Description and use cases

### 2.2. Advanced Features API

#### `@some-package/advanced`

- `advancedFunction` - Complex feature implementation
- `AdvancedType` - Type for advanced scenarios

## 3. Features

This section describes how the APIs listed above are combined to implement high-level architectural features.

### 3.1. [Feature Name 1]

**Combined APIs:** `API1` + `API2` + `API3`

**Implementation:**

1. Step one of how APIs work together
2. Step two showing the combination
3. Result: What this achieves

### 3.2. [Feature Name 2]

**Combined APIs:** `API4` + `API5`

**Implementation:**

1. Description of the implementation approach
2. How the APIs are orchestrated
3. End result and benefits

## 4. Application

This section describes how the features above are implemented and used in our project.

### 4.1. [Module/Component Name 1]

**Based on Feature:** [Feature Name 1]

**Implemented Functions:**

- `functionA()` - Description of what this function does
- `functionB()` - Another implemented function

**Usage Examples:**

```typescript
// Example of how to use the implemented functions
const result = await ipc.client.module.functionA();
```

### 4.2. [Module/Component Name 2]

**Based on Feature:** [Feature Name 2]

**Implemented Functions:**

- `functionC()` - Description
- `functionD()` - Description

**Implementation:**

```typescript
// Code showing the internal implementation pattern
const implementation = () => {
  // How the feature is applied
};
```

## 5. Common Issues

This section is a curated list of problems we have actually encountered and solved.

### 5.1. Issue: [Descriptive Title of the Problem]

- **Symptoms**: What users experience when this issue occurs
- **Root Cause**: Why this problem happens technically
- **Solution**: How to fix or work around the issue
