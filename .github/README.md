# GitHub Configuration Directory

This directory contains GitHub-specific configuration files and workflows for the Convention App project.

## Note About READMEs

**Important:** This README.md file is only for documenting the .github directory itself. GitHub uses the README.md in the root directory of the repository as the front page/landing page of the repository.

If you want to modify the main project documentation that appears on the repository's home page, edit:
`CONVENTION-APP/README.md`

## Contents

### Workflows

The `workflows` directory contains GitHub Actions workflow definitions:

- `ci.yml` - Continuous Integration workflow that runs tests and linting
- `deploy.yml` - Deployment workflow for the application
- `dependency-check.yml` - Automated dependency vulnerability scanning

### Issue Templates

The `ISSUE_TEMPLATE` directory contains templates for different types of issues:

- `bug_report.md` - Template for reporting bugs
- `feature_request.md` - Template for suggesting new features
- `config.yml` - Configuration for the issue templates

### Pull Request Template

- `PULL_REQUEST_TEMPLATE.md` - Template for pull requests

### Other Configuration

- `dependabot.yml` - Configuration for Dependabot, which keeps dependencies up to date
- `stale.yml` - Configuration for the Stale bot, which manages inactive issues

## Usage

These configurations help standardize contributions to the Convention App and automate common tasks like testing, deployment, and dependency management.

To learn more about GitHub Actions and other GitHub features, visit the [GitHub Documentation](https://docs.github.com/en).
