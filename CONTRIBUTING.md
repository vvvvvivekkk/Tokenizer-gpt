# Contributing to GPT-Style Tokenizer

Thank you for your interest in contributing! Here's how you can help.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/tokenizer.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Install dependencies: `npm install`

## Development Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Making Changes

### Code Style
- Use TypeScript
- Follow ESLint rules: `npm run lint`
- Format with Prettier automatically on save

### Testing
- Write tests for new features
- Run tests: `npm run test:unit`
- E2E tests: `npm run test:e2e`
- Aim for >80% coverage

### Database Changes
If modifying the Prisma schema:
```bash
npx prisma migrate dev --name your_migration_name
```

## Commit Guidelines

- Use descriptive commit messages
- Start with: feat:, fix:, docs:, test:, chore:
- Example: `feat: add token visualization hover`

## Pull Request Process

1. Push your branch: `git push origin feature/my-feature`
2. Create a Pull Request on GitHub
3. Fill out the PR template
4. Ensure all checks pass
5. Request reviews from maintainers

## Areas for Contribution

- 🐛 Bug fixes
- 🎨 UI/UX improvements
- 📚 Documentation
- 🧪 Tests
- ⚡ Performance optimization
- 🌍 Internationalization
- 📱 Mobile improvements

## Reporting Issues

- Check existing issues first
- Provide detailed reproduction steps
- Include screenshots/videos if possible
- Specify your environment (OS, browser, Node version)

## Questions?

- Open a discussion on GitHub
- Check documentation in README.md
- Review existing issues and PRs

---

**Happy contributing! 🎉**
