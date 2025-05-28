# Convention App Backend

This backend provides APIs for user authentication, event data, announcements, user profiles, and ticketing/check-in for the Convention App Client.

## Features

- User authentication (register, login, JWT-based sessions)
- Event data management (CRUD for events)
- Announcements (create, list, update, delete)
- User profiles (view and update)
- Ticketing and check-in

## Tech Stack

- Node.js
- Express
- MongoDB (via Mongoose)
- JWT for authentication

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```

2. Set environment variables (see `.env.example`).

3. Start the server:
   ```sh
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT
- `GET /api/events` - List all events
- `POST /api/events` - Create a new event
- `GET /api/announcements` - List announcements
- `POST /api/announcements` - Create an announcement
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/tickets/checkin` - Check in with a ticket

## Contribution

1. Fork and branch from `main`.
2. Add tests for new features.
3. Open a pull request with a clear description.

## License

MIT
