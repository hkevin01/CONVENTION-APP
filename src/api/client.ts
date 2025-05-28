// To fix: npm install axios
// If using TypeScript <4.9: npm install --save-dev @types/axios
// To avoid local TypeScript errors about missing axios types, but not affect Docker builds,
// you can use a try/catch dynamic import for local development, or ensure axios is always installed as a dependency.
// The best practice is to always have axios in your package.json dependencies, so both local and Docker builds work the same.

// If you want to suppress the error locally without installing axios (not recommended for real usage), you can use:
// @ts-ignore before the import (not recommended for production code):

// @ts-ignore
import axios from 'axios';

// Note: The instructions about installing axios are for your local development environment.
// If you're using Docker, make sure your Dockerfile includes the necessary commands to install dependencies, e.g.:
// RUN npm install
import { API_URL } from '../constants/Api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;

// If you still get "Cannot find module 'axios' or its corresponding type declarations":
// 1. Run in your project root:
//    npm install axios
//    npm install --save-dev @types/axios
// 2. If using pnpm or yarn, use the equivalent commands.
// 3. Restart your TypeScript server or IDE after installing.
