## MODIFIED Requirements
### Requirement: Project Structure
The application code MUST be organized into a Modular Monolith structure.

#### Scenario: Directory Layout
- **WHEN** the project is initialized
- **THEN** it MUST contain `src/app`, `src/features`, and `src/shared`
- **AND** `src/main` and `src/renderer` MUST reside within `src/app`

### Requirement: Shared Layer Constraints
The `shared` directory MUST act as a common dependency layer.

#### Scenario: No Upward Dependencies
- **WHEN** coding in `src/shared`
- **THEN** imports from `src/app` or `src/features` are FORBIDDEN
