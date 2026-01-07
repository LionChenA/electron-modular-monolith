## ADDED Requirements
### Requirement: Type-Safe IPC
All communication between Renderer and Main processes MUST use ORPC.

#### Scenario: Calling a Main Process Function
- **WHEN** a Renderer component needs to invoke a backend function
- **THEN** it MUST use the typed `orpc` client
- **AND** it MUST NOT use `ipcRenderer.send` or `invoke` directly

### Requirement: Dependency Injection
The application MUST follow a strict DI strategy based on the process scope.

#### Scenario: Main Process Logic
- **WHEN** implementing business logic in the Main process
- **THEN** dependencies MUST be passed via function parameters (Context)

#### Scenario: Renderer Process Logic
- **WHEN** accessing dependencies in React components
- **THEN** they MUST be consumed via React Hooks or Context

### Requirement: Event Broadcasting
The application MUST support a type-safe mechanism for the Main process to push events to the Renderer.

#### Scenario: Server-Side Event Push
- **WHEN** the Main process publishes an event (e.g., via `ctx.bus.emit`)
- **THEN** the Renderer MUST be able to subscribe to it using an ORPC Subscription hook
- **AND** the payload MUST be typed end-to-end
