# JSON Directory

This directory contains JSON configuration and data files used by the application.

## Core Configuration Files Not Moved Here

The following JSON files must remain in the project root:

1. **package.json** - Must stay at the root as npm/yarn/node requires it there
2. **tsconfig.json** - Must stay at the root for TypeScript compiler to find it
3. **app.json** - Must stay at the root for Expo to properly configure the app

## What Belongs Here

This directory is for JSON files that are:
- Used by the application at runtime
- Custom configuration that isn't required to be in a specific location
- Data files in JSON format

Examples include:
- Theme configuration
- Feature flags
- Mock data
- Translations
