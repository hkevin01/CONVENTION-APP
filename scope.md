# Project Scope: Convention App Client

## Overview

This project is the main frontend client for the Convention App, built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev). It provides a cross-platform mobile and web application for managing and interacting with convention-related features.

## Purpose

- Deliver a modern, responsive, and maintainable client for convention attendees and organizers.
- Support Android, iOS, and web platforms using a single codebase.
- Leverage Expo's file-based routing and asset management for rapid development.

## Key Features

- **File-based Routing:** Uses Expo Router for organizing screens and navigation.
- **Reusable Components:** Includes a library of themed and animated UI components.
- **Custom Hooks:** Provides hooks for theme management, color schemes, and more.
- **Asset Management:** Assets (images, fonts, etc.) are organized at the project root for Expo compatibility.
- **Testing:** Includes basic test setup with Jest and React Native Testing Library.
- **Theming:** Supports light and dark mode with customizable color schemes.
- **Animations:** Integrates `react-native-reanimated` for interactive UI effects.
- **Documentation:** Each major directory contains a README for structure and usage guidance.

## Directory Structure

- `app/` - Main application routes and screens.
- `components/` - Reusable UI components.
- `constants/` - Application-wide constants (e.g., colors).
- `hooks/` - Custom React hooks.
- `assets/` - Static assets (images, fonts, etc.), organized in subfolders.
- `scripts/` - Utility scripts for project maintenance.
- `.copilot/`, `.github/`, `.vscode/` - Configuration and documentation.

## Intended Audience

- Convention attendees seeking schedules, maps, and event info.
- Organizers managing event logistics and communication.
- Developers extending or maintaining the client.

## Technologies Used

- Expo & React Native
- TypeScript
- Jest (testing)
- Expo Router
- React Native Reanimated

## Notes

- The project is structured for scalability and maintainability.
- See individual directory READMEs for more details.
