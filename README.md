# Convention App 🎭

[![Build Status](https://github.com/hkevin01/CONVENTION-APP/actions/workflows/build.yml/badge.svg)](https://github.com/hkevin01/CONVENTION-APP/actions/workflows/build.yml)
[![Test Status](https://github.com/hkevin01/CONVENTION-APP/actions/workflows/test.yml/badge.svg)](https://github.com/hkevin01/CONVENTION-APP/actions/workflows/test.yml)
[![Deploy Status](https://github.com/hkevin01/CONVENTION-APP/actions/workflows/deploy.yml/badge.svg)](https://github.com/hkevin01/CONVENTION-APP/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive full-stack mobile and web application designed to revolutionize the convention experience. Built with React Native, Expo, Node.js, and MongoDB, this platform provides a seamless digital ecosystem for convention attendees, organizers, and vendors.

**🚀 Proposal for ConventionCatCorp** - This application is designed as a potential contribution to the [ConventionCatCorp](https://github.com/ConventionCatCorp) ecosystem, with built-in compatibility and integration capabilities for their services and tools.

## 🌟 Key Features

### For Attendees
- **Event Discovery**: Browse and search through convention schedules, workshops, and special events
- **Personal Agenda**: Create custom schedules and receive smart notifications
- **Interactive Maps**: Navigate convention venues with ease
- **Real-time Updates**: Instant announcements and schedule changes
- **Social Features**: Connect with other attendees and share experiences
- **Digital Tickets**: Secure QR code-based entry system

### For Organizers
- **Event Management**: Comprehensive dashboard for creating and managing events
- **Attendee Analytics**: Real-time insights and engagement metrics
- **Announcement System**: Broadcast updates instantly to all users
- **Vendor Coordination**: Streamlined communication with exhibitors
- **Resource Planning**: Track capacity, schedules, and logistics

### For Vendors/Exhibitors
- **Booth Management**: Digital presence with multimedia content
- **Lead Capture**: Collect and manage prospect information
- **Product Showcase**: Interactive catalogs and demonstrations
- **Networking Tools**: Connect with attendees and other vendors

## 🏗️ Architecture

This is a modern full-stack application with:

- **Frontend**: React Native with Expo for cross-platform mobile development
- **Backend**: Node.js with Express.js for robust API services
- **Database**: MongoDB for flexible, scalable data storage
- **Real-time**: WebSocket support for live updates
- **Authentication**: JWT-based secure user management
- **File Storage**: Cloud-based asset management
- **Deployment**: Docker containerization with CI/CD pipelines
- **Integration**: Designed with ConventionCatCorp compatibility in mind

### Proposed ConventionCatCorp Integration

This application is built with integration capabilities for the ConventionCatCorp ecosystem:
- **API Compatibility**: Follows ConventionCatCorp API standards and conventions
- **SSO Ready**: Pre-built support for ConventionCatCorp identity services integration
- **Data Format Compatibility**: Uses data structures compatible with ConventionCatCorp platforms
- **Microservices Ready**: Modular architecture designed for easy ecosystem integration

## 📱 Platform Support

- **iOS**: Native iOS app via Expo
- **Android**: Native Android app via Expo  
- **Web**: Progressive Web App (PWA) support
- **Tablet**: Optimized layouts for larger screens

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- MongoDB (local installation or cloud service)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   gh repo clone hkevin01/CONVENTION-APP
   cd CONVENTION-APP
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables:**
   
   Create `.env` in the root directory:
   ```env
   API_URL=http://localhost:4000/api
   EXPO_PUBLIC_API_URL=http://localhost:4000/api
   ```
   
   Create `backend/.env`:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/convention-app
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   
   # ConventionCatCorp Integration (Optional - for testing integration)
   CONVENTION_CAT_API_URL=https://api.conventioncatcorp.com
   CONVENTION_CAT_API_KEY=your-api-key-here
   SSO_PROVIDER_URL=https://auth.conventioncatcorp.com
   ```

5. **Start the full stack application:**
   ```bash
   npm run fullstack
   ```
   
   Or start services individually:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend  
   npm start
   ```

### Development Options

- **Mobile Development (Expo Go):**
  ```bash
  npm start
  # Scan QR code with Expo Go app
  ```

- **iOS Simulator:**
  ```bash
  npm run ios
  ```

- **Android Emulator:**
  ```bash
  npm run android
  ```

- **Web Browser:**
  ```bash
  npm run web
  ```

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration. Create the following files:

**Root `.env` (Frontend):**
```env
# API Configuration
API_URL=http://localhost:4000/api
EXPO_PUBLIC_API_URL=http://localhost:4000/api

# ConventionCatCorp Integration (Optional - for testing integration)
EXPO_PUBLIC_CONVENTION_CAT_API_URL=https://api.conventioncatcorp.com
EXPO_PUBLIC_SSO_PROVIDER_URL=https://auth.conventioncatcorp.com

# Feature Flags
EXPO_PUBLIC_ENABLE_DEV_TOOLS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false

# Push Notifications (optional)
EXPO_PUBLIC_PUSH_NOTIFICATION_KEY=your-expo-push-key
```

**`backend/.env` (Backend):**
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/convention-app

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:8081,exp://192.168.1.100:8081

# ConventionCatCorp Integration (Optional - for testing integration)
CONVENTION_CAT_API_URL=https://api.conventioncatcorp.com
CONVENTION_CAT_API_KEY=your-api-key-here
SSO_PROVIDER_URL=https://auth.conventioncatcorp.com
SSO_CLIENT_ID=your-sso-client-id
SSO_CLIENT_SECRET=your-sso-client-secret

# File Upload (optional)
UPLOAD_MAX_SIZE=5MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
```

### Database Setup

1. **Local MongoDB:**
   ```bash
   # Install MongoDB locally
   brew install mongodb/brew/mongodb-community  # macOS
   sudo apt install mongodb  # Ubuntu
   
   # Start MongoDB service
   mongod
   ```

2. **MongoDB Atlas (Cloud):**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create cluster and get connection string
   - Update `MONGODB_URI` in `backend/.env`

## 📊 API Documentation

The backend provides RESTful APIs for all functionality:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Event Management
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event (organizers only)
- `PUT /api/events/:id` - Update event (organizers only)
- `DELETE /api/events/:id` - Delete event (organizers only)

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/profile/avatar` - Upload profile picture

### Announcements
- `GET /api/announcements` - Get announcements
- `POST /api/announcements` - Create announcement (organizers only)

### Tickets
- `GET /api/tickets` - Get user tickets
- `POST /api/tickets/purchase` - Purchase event ticket
- `GET /api/tickets/:id/qr` - Get QR code for ticket

### ConventionCatCorp Integration (Proposed)
- `GET /api/integration/status` - Check ConventionCatCorp connection status
- `POST /api/integration/sync` - Sync data with ConventionCatCorp services
- `GET /api/integration/events` - Get events from ConventionCatCorp API
- `POST /api/integration/sso` - Single sign-on authentication

*Note: These endpoints are designed for future ConventionCatCorp integration and may require ConventionCatCorp API access.*

For detailed API documentation, see [`docs/api.md`](docs/api.md).

## 🐳 Docker Development

### Using Docker Compose (Recommended)

Run the full stack with one command:

```bash
# Build and start all services
npm run docker:up

# Or use docker-compose directly
docker-compose -f docker/docker-compose.yml up --build
```

This starts:
- Frontend (React Native web) on port 8081
- Backend API on port 4000  
- MongoDB on port 27017

### Individual Container Management

```bash
# Build all containers
npm run docker:build

# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
docker-compose -f docker/docker-compose.yml logs -f

# Access container shell
docker-compose -f docker/docker-compose.yml exec backend bash
```

### Frontend Only Docker

```bash
# Build frontend container
docker build -t convention-frontend .

# Run with port mapping
docker run -p 8081:8081 -p 19000:19000 -p 19001:19001 convention-frontend
```

## 🚀 Deployment

### Production Environment Setup

1. **Frontend (Expo/EAS):**
   ```bash
   # Install EAS CLI
   npm install -g eas-cli
   
   # Login to Expo
   eas login
   
   # Configure build
   eas build:configure
   
   # Build for production
   eas build --platform all
   
   # Submit to app stores
   eas submit
   ```

2. **Backend (Node.js):**
   - Deploy to Heroku, AWS, DigitalOcean, or any Node.js hosting
   - Set production environment variables
   - Configure MongoDB Atlas for production database
   - Set up SSL certificates for HTTPS

3. **Database (MongoDB Atlas):**
   - Create production cluster
   - Configure IP whitelist and users
   - Set up automated backups
   - Monitor performance and usage

### Environment-Specific Configurations

**Staging:**
```env
NODE_ENV=staging
API_URL=https://api-staging.yourapp.com
MONGODB_URI=mongodb+srv://staging-cluster...

# ConventionCatCorp Integration - Staging (if integrated)
CONVENTION_CAT_API_URL=https://api-staging.conventioncatcorp.com
SSO_PROVIDER_URL=https://auth-staging.conventioncatcorp.com
```

**Production:**
```env
NODE_ENV=production
API_URL=https://api.yourapp.com
MONGODB_URI=mongodb+srv://production-cluster...
JWT_SECRET=super-secure-production-secret

# ConventionCatCorp Integration - Production (if integrated)
CONVENTION_CAT_API_URL=https://api.conventioncatcorp.com
SSO_PROVIDER_URL=https://auth.conventioncatcorp.com
```

## 🧪 Testing

### Frontend Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test HomeScreen.test.tsx
```

### Backend Testing

```bash
cd backend

# Run API tests
npm test

# Run integration tests
npm run test:integration

# Test with coverage
npm run test:coverage
```

### End-to-End Testing

```bash
# Install E2E dependencies
npm install -g detox-cli

# Build app for testing
npm run e2e:build

# Run E2E tests
npm run e2e:test
```

## 🛠️ Development Tools

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### Debugging

- **React Native Debugger**: Use for Redux, React DevTools, and network inspection
- **Flipper**: Facebook's debugging platform for React Native
- **Expo Dev Tools**: Built-in debugging and inspection tools

### Useful Scripts

```bash
# Full stack development
npm run fullstack

# Stop all services
npm run stop

# Clean and reset
npm run clean
npm run reset-project

# Database utilities
npm run db:seed      # Seed with sample data
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
```

## 📁 Project Structure

```
CONVENTION-APP/
├── 📱 Frontend (React Native/Expo)
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── constants/     # App constants and config
│   │   ├── hooks/         # Custom React hooks
│   │   └── api/           # API client and services
│   ├── assets/            # Images, fonts, icons
│   └── __tests__/         # Frontend tests
│
├── 🖥️ Backend (Node.js/Express)
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   └── tests/             # Backend tests
│
├── 🐳 Docker
│   ├── docker-compose.yml # Multi-service orchestration
│   └── Dockerfiles        # Container definitions
│
├── 📚 Documentation
│   ├── docs/              # Comprehensive guides
│   ├── api/               # API documentation
│   └── deployment/        # Deployment guides
│
└── 🛠️ Scripts & Config
    ├── scripts/           # Automation scripts
    ├── json/              # Configuration files
    └── config files       # Babel, TypeScript, etc.
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. **Fork the repository** and clone your fork
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Install dependencies** and set up your environment
4. **Make your changes** following our coding standards

### Code Standards

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the configured linting rules
- **Prettier**: Format code consistently
- **Commits**: Use conventional commit format:
  ```
  feat: add user authentication
  fix: resolve navigation issue
  docs: update API documentation
  ```

### Pull Request Process

1. **Update documentation** for any new features
2. **Add tests** for new functionality
3. **Ensure all tests pass**: `npm test`
4. **Check code quality**: `npm run lint`
5. **Submit PR** with clear description

### Development Workflow

1. **Issues**: Create issues for bugs and feature requests
2. **Discussions**: Use GitHub Discussions for questions
3. **Reviews**: All PRs require review before merging
4. **Testing**: Maintain high test coverage

For detailed contribution guidelines, see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

- **[User Guide](docs/user-guide.md)** - How to use the app
- **[Developer Guide](docs/developer-guide.md)** - Development setup and workflows  
- **[API Documentation](docs/api.md)** - Backend API reference
- **[Deployment Guide](docs/deployment.md)** - Production deployment
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute

## 🔗 Links & Resources

- **Repository**: [https://github.com/hkevin01/CONVENTION-APP](https://github.com/hkevin01/CONVENTION-APP)
- **Issues**: [GitHub Issues](https://github.com/hkevin01/CONVENTION-APP/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hkevin01/CONVENTION-APP/discussions)

### ConventionCatCorp (Proposed Integration Target)

- **ConventionCatCorp Organization**: [https://github.com/ConventionCatCorp](https://github.com/ConventionCatCorp)
- **Proposal Discussion**: *Open to discussion with ConventionCatCorp team*

### Technology Documentation

- **[React Native](https://reactnative.dev/docs/getting-started)** - Mobile framework
- **[Expo](https://docs.expo.dev/)** - Development platform
- **[Node.js](https://nodejs.org/docs/)** - Backend runtime
- **[MongoDB](https://docs.mongodb.com/)** - Database
- **[Express.js](https://expressjs.com/)** - Web framework

### ConventionCatCorp Resources (For Integration Reference)

- **[ConventionCatCorp Main Site](https://conventioncatcorp.com)** - Company website
- **[API Documentation](https://api.conventioncatcorp.com/docs)** - ConventionCatCorp API reference
- **[Developer Portal](https://developers.conventioncatcorp.com)** - Integration guides and resources
- **[Status Page](https://status.conventioncatcorp.com)** - Service status and uptime

## 🎯 Proposal for ConventionCatCorp

This project is designed as a potential contribution to the ConventionCatCorp ecosystem. Key features that align with ConventionCatCorp's mission:

### Why This Integration Makes Sense

- **Modern Stack**: Built with current best practices and scalable technologies
- **Cross-Platform**: Native mobile apps + web support reaches all users
- **Microservices Ready**: Modular architecture fits ecosystem approach
- **Standards Compliant**: Follows industry standards for APIs and authentication
- **Community Focused**: Open source with clear contribution guidelines

### Integration Benefits

- **Seamless User Experience**: Single sign-on across all ConventionCatCorp services
- **Data Consistency**: Standardized data formats and real-time synchronization
- **Scalable Architecture**: Can grow with the ConventionCatCorp ecosystem
- **Developer Friendly**: Well-documented APIs and clear development workflows

## ❓ Support & FAQ

### Common Issues

**Q: App won't start in Expo Go**
```bash
# Clear Expo cache
expo start -c
```

**Q: Backend connection refused**
```bash
# Check if backend is running
curl http://localhost:4000/api/health

# Restart backend
cd backend && npm run dev
```

**Q: MongoDB connection error**
```bash
# Check MongoDB status
mongod --dbpath /path/to/your/db

# Or use MongoDB Atlas cloud service
```

**Q: Dependencies not installing**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- **Create an Issue**: For bugs and feature requests
- **GitHub Discussions**: For questions and community support
- **Documentation**: Check the docs/ folder first
- **Stack Overflow**: Tag with `convention-app` for community help

### ConventionCatCorp Integration Questions

- **Contact**: Open to discussing integration possibilities with ConventionCatCorp team
- **Proposal**: This project can be adapted to fit ConventionCatCorp standards and requirements

---

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev)
- Icons by [Expo Vector Icons](https://icons.expo.fyi)
- UI inspiration from modern convention apps
- Community contributions and feedback
- **ConventionCatCorp** for inspiring the integration-ready architecture

---

**Made with ❤️ for the convention community**

> Convention App - Connecting people, one event at a time 🎭
> 
> *Designed with ConventionCatCorp integration in mind*
