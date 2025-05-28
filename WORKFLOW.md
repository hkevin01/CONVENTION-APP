# Development Workflow

## Branching Strategy

- **main**: Stable, production-ready code.
- **feature/\***: New features and enhancements.
- **bugfix/\***: Bug fixes.
- **hotfix/\***: Critical fixes for production.
- Use descriptive branch names (e.g., `feature/login-screen`).

## CI/CD Pipelines

- **Build**: Runs on every push and pull request to `main`. Ensures the project builds successfully.
- **Test**: Runs automated tests on every push and pull request.
- **Deploy**: Runs on push to `main` and handles deployment (customize as needed).

## Code Review Process

1. Open a pull request (PR) from your feature/bugfix branch to `main`.
2. Ensure all CI checks pass before requesting review.
3. At least one reviewer must approve the PR.
4. Address feedback and resolve conflicts before merging.
5. Use clear, descriptive commit messages and PR descriptions.

## Additional Guidelines

- Keep PRs focused and small.
- Write tests for new features and bug fixes.
- Ensure code is linted and formatted before submitting (`npm run lint` and `npm run format`).
