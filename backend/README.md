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

## MongoDB Connection Features

The backend provides several robust features for MongoDB connectivity:

### 1. Connection Options

The application uses enhanced connection options for better reliability:

```javascript
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,  // How long to try selecting a server
  socketTimeoutMS: 45000,          // How long to wait for responses
  connectTimeoutMS: 10000,         // Connection timeout
  retryWrites: true,               // Automatically retry write operations
  retryReads: true,                // Automatically retry read operations
};
```

### 2. Development Mode Without MongoDB

For development purposes, the application can run without MongoDB:

- Set `ALLOW_NO_MONGO=true` in your `.env` file
- The server will start even if MongoDB connection fails
- Warning messages will indicate limited functionality

### 3. Clear Error Messages

When MongoDB connection fails, the application provides:
- Detailed error messages
- Suggestions for troubleshooting
- Information about development mode options

### 4. Environment Configuration

The `.env` file includes:

```
# Database Configuration
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/convention-app

# MongoDB Atlas (uncomment and replace with your connection string)
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/convention-app

# Development Settings
NODE_ENV=development
# Set to true to allow the app to run without MongoDB during development
ALLOW_NO_MONGO=true
```

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
