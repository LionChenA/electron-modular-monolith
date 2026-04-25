# Testing Strategy Knowledge Base

This directory contains the project's testing knowledge, including lessons learned from implementing the `add-business-tests` proposal.

## Contents

### [Overview](./overview.md)
High-level summary of the testing strategy, including the four test layers (unit, integration, component, E2E) and tool-to-target mapping.

### [Tool Selection Guide](./tool-selection.md)
Decision matrix and usage examples for selecting the right testing tool for each scenario.

### [Common Pitfalls](./common-pitfalls.md)
Catalog of problems actually encountered during implementation, with symptoms, root causes, and solutions.

## Quick Reference

| What You're Testing | Use This Tool |
|---------------------|---------------|
| Pure functions | Vitest |
| Module with dependencies | Vitest + `vi.mock()` |
| ORPC handler logic | `call()` + mocked context |
| TanStack Query components | `vi.mock()` |
| HTTP transport layer | HTTPLink + MSW |
| Full application | Playwright (E2E) |

## Related Specifications

- `specs/communication/spec.md` - ORPC router conventions (includes Zod tag requirements)
- `specs/unit_integration_testing/spec.md` - Unit and integration testing infrastructure
- `specs/component_visual_testing/spec.md` - Storybook and visual testing
- `specs/e2e_electron_testing/spec.md` - E2E testing with Playwright