# Deployment Guide

## Frontend (Expo/React Native)

### Expo Go / EAS

1. Install Expo CLI:
   ```sh
   npm install -g expo-cli
   ```
2. Log in to Expo:
   ```sh
   expo login
   ```
3. Build for production:
   ```sh
   npx expo export:web
   # or for native builds:
   npx expo prebuild
   npx eas build --platform all
   ```
4. Deploy web build to Vercel/Netlify or native builds to app stores.

### Environment Variables

- Set API URLs and other secrets in `.env` and `app.json`'s `extra` field.
- Never commit secrets to version control.

## Backend (Node.js/Express)

### Cloud/VPS Deployment

1. Set up a server (Heroku, AWS, DigitalOcean, etc.).
2. Set environment variables (`MONGO_URI`, `JWT_SECRET`, etc.).
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the server:
   ```sh
   npm run start
   ```

### Environment Variables

- Store secrets securely (use Heroku Config Vars, AWS Secrets Manager, etc.).
- Never commit `.env` files with secrets.

## CI/CD

- GitHub Actions workflows handle build, test, and deploy.
- Configure secrets in GitHub repository settings.

## References

- [Expo Deployment Docs](https://docs.expo.dev/distribution/introduction/)
- [Heroku Node.js Deployment](https://devcenter.heroku.com/articles/deploying-nodejs)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
