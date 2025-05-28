# Developer Guide

This guide provides information for developers working on the Convention App.

## Project Structure

- `src/` — Frontend source code (React Native/Expo)
- `backend/` — Backend API (Node.js/Express)
- `docs/` — Documentation
- `assets/` — Images, fonts, and other static assets

## Setup

1. **Clone the repository**
2. **Install dependencies** for both frontend and backend:
   ```sh
   npm install
   cd backend && npm install
   ```
3. **Set up environment variables** (`.env` files for both frontend and backend)
4. **Start the backend**:
   ```sh
   npm run dev
   ```
5. **Start the frontend**:
   ```sh
   npm start
   ```

## Testing

- Frontend: Run `npm test` in the root directory.
- Backend: Add and run tests as needed in the `backend/` directory.

## API

- See [api.md](./api.md) and [openapi.yaml](./openapi.yaml) for backend API documentation.

## Contribution

- Follow the guidelines in [CONTRIBUTING.md](../CONTRIBUTING.md).
- Use feature branches and submit pull requests for review.
