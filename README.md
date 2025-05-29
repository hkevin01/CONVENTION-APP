<!--
  Copilot Focus: This file provides a project summary, installation instructions, usage examples, and contribution guidelines.
  When editing, keep documentation clear and up to date for new contributors.
-->

# Convention App Client

[![Frontend Build Status](https://github.com/yourusername/convention-app-client/actions/workflows/build.yml/badge.svg)](https://github.com/yourusername/convention-app-client/actions/workflows/build.yml)
[![Frontend Test Status](https://github.com/yourusername/convention-app-client/actions/workflows/test.yml/badge.svg)](https://github.com/yourusername/convention-app-client/actions/workflows/test.yml)
[![Backend Deploy Status](https://github.com/yourusername/convention-app-client/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/convention-app-client/actions/workflows/deploy.yml)

A modern mobile application for managing and attending conventions, built with React Native and Expo. This project aims to provide attendees and organizers with a seamless experience for schedules, announcements, and event participation.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Convention App Client

A modern mobile application for managing and attending conventions, built with React Native and Expo. This project aims to provide attendees and organizers with a seamless experience for schedules, announcements, and event participation.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/convention-app-client.git
   cd convention-app-client
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

## Usage

- To run on Android:
  ```sh
  npm run android
  ```
- To run on iOS:
  ```sh
  npm run ios
  ```
- To run on web:
  ```sh
  npm run web
  ```

## Environment Variables

Create a `.env` file at the project root to configure API endpoints and other environment-specific settings. Example:

```env
API_URL=http://localhost:4000/api
```

You can access these variables in your code using [expo-constants](https://docs.expo.dev/versions/latest/sdk/constants/) or a library like [`react-native-dotenv`](https://github.com/goatandsheep/react-native-dotenv).

## API Integration

The frontend communicates with the backend via REST APIs. Use `fetch` or `axios` to make requests to the backend endpoints defined in your `.env` file.

Example usage with `axios`:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_URL,
});

export async function fetchEvents() {
  const response = await api.get('/events');
  return response.data;
}
```

## API Client Setup

This project uses [axios](https://github.com/axios/axios) for HTTP requests.

If you see errors like:
> Cannot find module 'axios' or its corresponding type declarations

Install axios and its types:

```sh
npm install axios
npm install --save-dev @types/axios
```

If you use TypeScript >=4.9, @types/axios may not be needed as axios ships its own types.

## Deployment

### Frontend

- The Expo/React Native frontend can be deployed using [Expo Application Services (EAS)](https://expo.dev/eas), Vercel, or Netlify for web builds.
- See [Expo deployment docs](https://docs.expo.dev/distribution/introduction/) for details.
- Environment variables are managed via `.env` files and `app.json`'s `extra` field.

### Backend

- The backend (in `/backend`) can be deployed to Heroku, AWS, DigitalOcean, or any cloud/VPS provider.
- Ensure environment variables (e.g., `MONGO_URI`, `JWT_SECRET`) are set securely in your deployment environment.
- See `/backend/README.md` for backend deployment instructions.

### CI/CD

- GitHub Actions workflows are set up for build, test, and deploy for both frontend and backend.
- Secrets and environment variables for CI/CD should be configured in your repository settings.

## Running Locally with Docker

You have two main options:

### 1. Using Docker Compose (Recommended for Full Stack)

This will start the frontend, backend, and MongoDB together:

```sh
./start.sh
```
or
```sh
docker-compose up --build
```

### 2. Building and Running the Frontend Dockerfile Directly

If you only want to run the frontend container:

```sh
docker build -t convention-frontend .
docker run -p 8081:8081 -p 19000:19000 -p 19001:19001 -p 19002:19002 convention-frontend
```

> **Note:**  
> The frontend expects the backend and MongoDB to be running and accessible at the URLs specified in your `.env` or Docker Compose configuration.  
> For a fully working environment, use Docker Compose as described above.

## Known Warnings and Errors

### MongoDB WiredTiger Checkpointer

You may see logs like:
```
[...]
```

These are normal warnings from MongoDB's WiredTiger storage engine. They can be safely ignored unless you experience actual data access issues.

## Repository Location

This project is hosted on GitHub:

[https://github.com/hkevin01/CONVENTION-APP](https://github.com/hkevin01/CONVENTION-APP)

## Contribution Guidelines

1. Fork the repository and create your branch from `main`.
2. Ensure code is linted and formatted (`npm run lint` and `npm run format`).
3. Add tests if applicable.
4. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Cloning the Repository with GitHub CLI

To clone this project using the GitHub CLI, run:

```sh
gh repo clone hkevin01/CONVENTION-APP
cd CONVENTION-APP
```

## GitHub CLI Configuration

This project supports the [GitHub CLI](https://cli.github.com/).

### Useful GitHub CLI Commands

- Clone the repo:
  ```sh
  gh repo clone hkevin01/CONVENTION-APP
  cd CONVENTION-APP
  ```

- Create a new issue:
  ```sh
  gh issue create --title "Bug: ..." --body "Describe the bug..."
  ```

- Create a pull request:
  ```sh
  gh pr create --fill
  ```

- View repo status:
  ```sh
  gh repo view --web
  ```

### GitHub CLI Dotfiles

A `.github` folder is already present for workflows.  
You can add GitHub CLI configuration in your home directory as needed:

- `~/.config/gh/hosts.yml` (for authentication)
- `~/.config/gh/config.yml` (for CLI settings)

See [GitHub CLI docs](https://cli.github.com/manual/) for more.

## After Pushing to GitHub

After you push your changes, you can view your repository at:

[https://github.com/hkevin01/CONVENTION-APP](https://github.com/hkevin01/CONVENTION-APP)

## How to Approve (Okay) a Commit or Pull Request on GitHub

1. Go to your repository on [GitHub](https://github.com/hkevin01/CONVENTION-APP).
2. Click on the "Pull requests" tab.
3. Select the pull request you want to review.
4. Review the changes (files, diffs, etc.).
5. Click the "Review changes" button (top right).
6. Choose "Approve" and optionally add a comment.
7. Click "Submit review".

If you want to merge the pull request after approving:
- Click the "Merge pull request" button.
