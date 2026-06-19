# Contributing to ESGss JunAiKey Beta

Thank you for your interest in contributing to **ESGss JunAiKey Beta**! ??

This document provides guidelines for contributing to the project.

---

## ?? Table of Contents

1. [Code of Conduct](#code-of-conduct)

2. [Getting Started](#getting-started)

3. [Development Workflow](#development-workflow)

4. [Coding Standards](#coding-standards)

5. [Commit Guidelines](#commit-guidelines)

6. [Pull Request Process](#pull-request-process)

7. [Testing Requirements](#testing-requirements)

8. [Documentation](#documentation)

---

## ?? Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Expected Behavior

- **Be respectful** of differing viewpoints

- **Be collaborative** and constructive in feedback

- **Be professional** in all communications

- **Focus on what is best** for the community

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments

- Trolling, insulting/derogatory comments, personal attacks

- Public or private harassment

- Publishing others' private information without permission

---

## ?? Getting Started

### Prerequisites

- Node.js 18+

- npm or pnpm

- Git

- (Optional) Docker for containerized development

### Initial Setup

```bash

# Clone the repository

git clone https://github.com/DingJun1028/esgss_junaikey_beta.git

cd esgss_junaikey_beta



# Install dependencies

npm install



# Copy environment template

cp .env.example .env



# Configure your API keys (see ENV_CONFIG_GUIDE.md)

# Edit .env with your keys



# Start development server

npm run dev

```

### Project Structure

Please read [ARCHITECTURE.md](file:///c:/Project/esgss_junaikey_beta/ARCHITECTURE.md) for a detailed understanding of the codebase structure.

---

## ?? Development Workflow

### 1. Create a Feature Branch

```bash

# Update main branch

git checkout dev

git pull origin dev



# Create feature branch

git checkout -b feature/your-feature-name



# Or for bug fixes

git checkout -b fix/issue-description

```

**Branch Naming Conventions**:

- `feature/` - New features

- `fix/` - Bug fixes

- `docs/` - Documentation updates

- `refactor/` - Code refactoring

- `test/` - Test additions/updates

- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code

- Follow TypeScript best practices

- Add comments for complex logic

- Update tests as needed

### 3. Test Your Changes

```bash

# Type check

npm run type-check



# Build to ensure no errors

npm run build



# Run E2E tests (if applicable)

npm run test:e2e

```

### 4. Commit Changes

```bash

git add .

git commit -m "feat(component): add new feature description"

```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push and Create PR

```bash

git push origin feature/your-feature-name

```

Then create a Pull Request on GitHub.

---

## ?? Coding Standards

### TypeScript

**Prefer explicit types**:

```typescript
// ??Good

const fetchData = async (): Promise<ScanResult> => {
  // ...
};

// ??Avoid

const fetchData = async () => {
  // ...
};
```

**Use interfaces for object shapes**:

```typescript

// ??Good

interface UserProfile {

  id: string;

  name: string;

  email: string;

}



// ??Avoid inline types

const user: { id: string; name: string } = { ... };

```

**Avoid `any`**:

```typescript

// ??Good

const parseData = (data: unknown): ParsedData => {

  if (isValidData(data)) {

    return data as ParsedData;

  }

  throw new Error('Invalid data');

};



// ??Avoid

const parseData = (data: any) => { ... };

```

---

### React Components

**Functional components with TypeScript**:

```typescript

// ??Good

interface Props {

  title: string;

  onClose: () => void;

}



export const Modal: React.FC<Props> = ({ title, onClose }) => {

  return <div>...</div>;

};



// ??Avoid default exports for components

export default Modal;

```

**Use meaningful component names**:

```typescript

// ??Good

<SecurityAnalysisModal />

<CostTrackerDashboard />



// ??Avoid

<Modal1 />

<Dashboard />

```

**Extract complex logic to hooks**:

```typescript
// ??Good

const { data, isLoading, error } = useFetchSecurityData();

// ??Avoid inline complex logic in JSX
```

---

### File Organization

**One component per file**:

```

src/components/dashboard/

??雓??????SecurityDashboard.tsx

??雓??????CostTracker.tsx

??雓??????KnowledgeGraphViewer.tsx

```

**Group related files**:

```

src/services/

??雓??????GeminiService.ts

??雓??????SnykService.ts

??雓??????AICoordinationService.ts

```

**Use index files for exports**:

```typescript
// src/components/dashboard/index.ts

export { SecurityDashboard } from './SecurityDashboard';

export { CostTracker } from './CostTracker';
```

---

## ??雓???Commit Guidelines

### Commit Message Format

```

<type>(<scope>): <subject>



<body>



<footer>

```

**Types**:

- `feat`: New feature

- `fix`: Bug fix

- `docs`: Documentation changes

- `style`: Code style changes (formatting, missing semi-colons, etc.)

- `refactor`: Code refactoring

- `test`: Adding/updating tests

- `chore`: Maintenance tasks

**Scopes**: `security`, `ai`, `ui`, `api`, `docs`, `deploy`, etc.

**Examples**:

```bash

feat(security): add AI deep analysis button to Security Dashboard



- Integrated AICoordinationService

- Added analysis result modal

- Implemented loading states



Closes #123

```

```bash

fix(knowledge): resolve embedding generation error



Fixed issue where Ollama service timeout caused graph update failures.

Added retry logic with exponential backoff.



Fixes #456

```

**Rules**:

- Use present tense ("add" not "added")

- Use imperative mood ("move" not "moves")

- Keep subject line under 72 characters

- Reference issues and PRs in footer

---

## ?? Pull Request Process

### Before Submitting

1. **Ensure your code builds**:

   ```bash

   npm run build

   ```

2. **Run type checks**:

   ```bash

   npm run type-check

   ```

3. **Format your code** (if using Prettier):

   ```bash

   npm run format

   ```

4. **Update documentation** if needed

5. **Add tests** for new features

---

### PR Template

When creating a PR, include:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix

- [ ] New feature

- [ ] Breaking change

- [ ] Documentation update

## How Has This Been Tested?

Describe testing approach

## Checklist

- [ ] Code builds without errors

- [ ] Type checks pass

- [ ] Tests added/updated

- [ ] Documentation updated

- [ ] Commit messages follow guidelines
```

---

### Review Process

1. **Automated checks** must pass (CI/CD)

2. **Code review** by at least one maintainer

3. **Address feedback** and update PR

4. **Squash and merge** once approved

---

## ??雓???Testing Requirements

### Unit Tests (When Available)

```typescript
// Example test structure

describe('AICoordinationService', () => {
  it('should perform full security analysis', async () => {
    const result = await AICoordinationService.performFullSecurityAnalysis();

    expect(result).toHaveProperty('scanResult');

    expect(result).toHaveProperty('insight');
  });
});
```

### E2E Tests

**Add tests for new user-facing features**:

```typescript
// e2e/my-feature.spec.ts

test('should display new feature correctly', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // ... test steps

  await expect(page.getByText('Expected Text')).toBeVisible();
});
```

**Run E2E tests**:

```bash

npx playwright test

```

---

## ?? Documentation

### Code Comments

**Document complex logic**:

```typescript
/**

 * Calculates cosine similarity between two embedding vectors

 * Uses dot product / (magnitude1 * magnitude2)

 * 

 * @param embedding1 - First embedding vector

 * @param embedding2 - Second embedding vector

 * @returns Similarity score between 0 and 1

 */

const cosineSimilarity = (
  embedding1: number[],

  embedding2: number[]
): number => {
  // Implementation
};
```

**Avoid obvious comments**:

```typescript
// ??Bad

// Increment counter

counter++;

// ??Good (no comment needed)

counter++;
```

---

### README Updates

**Update README.md if you**:

- Add new features

- Change setup process

- Modify npm scripts

- Add dependencies

---

### API Documentation

**Update API.md when adding/changing**:

- Service methods

- Event structures

- Type definitions

- Configuration options

---

## ??雓???Feature Requests

To suggest a new feature:

1. **Check existing issues** to avoid duplicates

2. **Create a GitHub issue** with:
   - Clear description

   - Use case

   - Expected behavior

   - Mockups (if UI feature)

3. **Label** as `enhancement`

4. **Wait for feedback** before implementing

---

## ?? Bug Reports

To report a bug:

1. **Search existing issues** first

2. **Create a GitHub issue** with:
   - Descriptive title

   - Steps to reproduce

   - Expected vs actual behavior

   - Screenshots/logs

   - Environment details (browser, OS, Node version)

3. **Label** as `bug`

4. **Severity** (critical/high/medium/low)

---

## ?? Security Vulnerabilities

**Do NOT** create public issues for security vulnerabilities.

Instead:

- Email: [security contact - to be configured]

- Include detailed description

- We will respond within 48 hours

---

## ?? Getting Help

- **Documentation**: Check docs in repo root

- **GitHub Discussions**: For questions and discussions

- **GitHub Issues**: For bugs and feature requests

- **Code Review**: Tag maintainers in PR

---

## ?? Recognition

Contributors will be recognized in:

- `CHANGELOG.md` (for significant contributions)

- GitHub contributors page

- Special mentions in release notes

---

## ?? License

By contributing, you agree that your contributions will be licensed under the same license as the project (Proprietary - ESGss ??2026).

---

**Thank you for contributing!** ??

Every contribution, no matter how small, makes a difference.

---

**Maintainers**:

- DingJun1028 - Project Owner

**Last Updated**: 2026-01-19

