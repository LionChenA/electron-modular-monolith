---
title: "Correct usage of ! prefix in Biome includes configuration"
tags: [troubleshooting, biome]
# List of official Context7 documentation IDs used as primary sources.
sources:
  - id: "/biomejs/biome"
# List of NPM packages from this ecosystem that are USED in our project.
packages:
  - id: "@biomejs/biome"
    description: "Code quality tool, alternative to ESLint + Prettier"
---

# Problem: Incorrect usage of +! instead of ! in Biome includes configuration

## Problem Description
When using Biome configuration with `includes` to exclude files, incorrectly using `+!` instead of `!` prefix causes the exclusion rules to not take effect.

## Incorrect Example
```json
{
  "linter": {
    "includes": ["src/**/*.ts", "+!node_modules/**"]
  }
}
```

## Correct Example
```json
{
  "linter": {
    "includes": ["src/**/*.ts", "!node_modules/**"]
  }
}
```

## Explanation
- `+!` is incorrect syntax and not recognized by Biome
- `!` alone is the correct prefix for exclusion rules
- In includes, `!` prefix means negation/negative pattern (exclude from linting/formatting but still indexed)
- The `!!` prefix has special meaning for double negation (exclude from ALL project operations, NOT indexed)

### Understanding ! vs !!

**Single `!` (Negation):**
```json
{
  "files": {
    "includes": [
      "**",
      "!**/*.generated.js"  // Ignored from linting/formatting but still indexed
    ]
  }
}
```

**Double `!!` (Double Negation):**
```json
{
  "files": {
    "includes": [
      "**",
      "!!**/dist"  // Ignored from ALL project operations (module graph, type inference), NOT indexed
    ]
  }
}
```

**Key Difference:**
- `!` - Files are excluded from formatting/linting but still participate in project operations (module resolution, type inference)
- `!!` - Files are completely excluded from all project operations and not indexed

**Project-related operations include:**
- Construction of internal module graph for import/export resolution
- Type inference for type-aware lint rules

## Project-Specific Commands
Based on this project's configuration:
- `pnpm check` - Format, lint, and apply safe fixes
- `pnpm check:unsafe` - Apply ALL fixes including unsafe ones

## Related Resources
- [Biome Configuration Documentation](https://biomejs.dev/reference/configuration/)
- [Biome File Ignore Patterns](https://biomejs.dev/guides/how-to-ignore-code/)
