# Running and Testing the Convention App Codebase

This guide explains how to run the frontend (Expo/React Native) and backend (Node.js/Express), as well as how to test both parts of the project.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (for backend data storage)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (for frontend, use `npx expo` instead of installing globally)

---

## 1. Clone the Repository

```sh
git clone https://github.com/yourusername/convention-app-client.git
cd convention-app-client
```

---

## 2. Running the Backend

1. Go to the backend directory:
   ```sh
   cd backend
   ```

2. Install backend dependencies:
   ```sh
   npm install
   ```

3. Copy the example environment file and edit as needed:
   ```sh
   cp .env.example .env
   # Edit .env to set MONGO_URI and JWT_SECRET
   ```

4. Start MongoDB if not already running.

5. Start the backend server:
   ```sh
   npm run dev
   ```
   The backend will run on [http://localhost:4000](http://localhost:4000) by default.

---

## 3. Running the Frontend

1. In a new terminal, return to the project root:
   ```sh
   cd ..
   ```

2. Install frontend dependencies:
   ```sh
   npm install
   ```

3. Copy the example environment file and edit as needed:
   ```sh
   cp .env.example .env
   # Edit .env to set API_URL if needed
   ```

4. Start the Expo development server:
   ```sh
   npm start
   ```
   - Use the Expo Go app or an emulator to run the app on your device.
   - For web, run `npm run web`.

---

## 4. Testing

### Frontend

- Run tests with:
  ```sh
  npm test
  ```
- Add tests in `src/components/__tests__/` and `src/app/__tests__/`.

### Backend

- (If tests are implemented) Run backend tests from the backend directory:
  ```sh
  cd backend
  npm test
  ```

---

## 5. API Documentation

- See [docs/api.md](./api.md) and [docs/openapi.yaml](./openapi.yaml) for backend API details.

---

## Troubleshooting

- Ensure MongoDB is running before starting the backend.
- Check `.env` files for correct configuration.
- For Expo issues, see [Expo documentation](https://docs.expo.dev/).

---

## Additional Resources

- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
- [Deployment Guide](./deployment.md)
