# Components Directory

This directory contains reusable UI components used throughout the application.

## Organization

Components are organized into several categories:

- **Root level** - Basic building blocks and simple components
- **Layout/** - Components for structural layout
- **Forms/** - Form inputs, buttons, and form-related components
- **Navigation/** - Navigation-related components
- **Modals/** - Modal dialogs and pop-ups
- **Cards/** - Card-style containers for content

## Component Guidelines

- Each component should have a single responsibility
- Components should be composable
- Include prop type definitions with TypeScript
- Document component props with JSDoc comments
- Include accessibility attributes (e.g., `accessibilityLabel`)
- Export default for main components, named exports for related utilities
