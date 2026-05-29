# Contributing to ESGGO

Thank you for considering contributing to ESGGO! Please read the following guidelines to help make the contribution process smooth and effective.

## How to Contribute

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/esggo.git
   cd esggo
   ```
3. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-fix-name
   ```
4. **Make your changes**, following the coding standards described below.
5. **Run the test suite** and ensure everything passes:
   ```bash
   npm run test
   ```
6. **Commit your changes** with a clear and descriptive commit message.
7. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** against the `main` branch of the original repository.

## Coding Standards

- Use **TypeScript** with strict mode enabled.
- Follow the existing code style; we use **ESLint** and **Prettier**.
  - Run `npm run lint` to check for linting errors.
  - Run `npm run format` to automatically format code.
- Write meaningful comments and keep documentation up-to-date.
- For new features, add corresponding unit and/or integration tests.
- Keep pull requests focused; if addressing multiple issues, consider splitting them.

## Reporting Issues

- Use the GitHub Issues tracker to report bugs or request features.
- Provide as much detail as possible: steps to reproduce, expected vs. actual behavior, environment details, and any relevant logs or screenshots.

## Code of Conduct

Please note that this project adheres to a Contributor Code of Conduct. By participating, you are expected to uphold this code. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details.

## License

By contributing, you agree that your contributions will be licensed under the project's license (see LICENSE file).

Thank you again for your contribution!