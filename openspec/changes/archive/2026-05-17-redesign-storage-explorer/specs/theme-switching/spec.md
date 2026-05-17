# Specification: Theme Switching

## Purpose

Define the requirements for user-controllable dark/light/system theme switching across the application. The underlying CSS variable definitions already exist in `index.css` for both themes — this spec covers the wiring to user-facing controls.

## Related Specs

- Current theme variables defined in `src/app/renderer/index.css` (`:root` for light, `.dark` for dark)

## Requirements

### Requirement: Theme Toggle

The application SHALL provide a theme toggle control accessible from any page.

#### Scenario: Toggle between themes
- **WHEN** the user clicks the theme toggle button in the top bar
- **THEN** the application switches between dark mode and light mode
- **AND** the preference is persisted for subsequent sessions

#### Scenario: System theme support
- **WHEN** the user selects "System" theme
- **THEN** the application follows the OS-level theme preference (`prefers-color-scheme`)
- **AND** the application updates in real-time if the OS theme changes

### Requirement: Theme Persistence

The user's theme preference SHALL be persisted across application restarts.

#### Scenario: Theme persists after restart
- **WHEN** the user selects a theme preference
- **AND** the application is closed and reopened
- **THEN** the previously selected theme is applied on startup

### Requirement: Settings Page Theme Selector

The Settings page SHALL provide a theme selector with explicit Light / Dark / System options.

#### Scenario: Light theme selected
- **WHEN** the user selects "Light" on the Settings page
- **THEN** the application switches to light theme immediately
- **AND** the top bar theme toggle reflects the current theme

#### Scenario: Dark theme selected
- **WHEN** the user selects "Dark" on the Settings page
- **THEN** the application switches to dark theme immediately

#### Scenario: System theme selected
- **WHEN** the user selects "System" on the Settings page
- **THEN** the application follows the OS theme preference
