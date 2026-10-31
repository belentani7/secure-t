# Contributing to secure-t

Thank you for your interest in contributing! Please follow these guidelines.

## 📋 Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** using Conventional Commits: `git commit -m 'feat: add amazing feature'`
4. **Push** to your fork: `git push origin feat/amazing-feature`
5. **Open** a Pull Request

## ✅ Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes

### Examples
```
feat(auth): add OAuth2 login
fix(api): handle 404 errors gracefully
docs(readme): update installation steps
```

## 🔍 Code Review Checklist

Use the repository's executable checks, not assumed tooling: `pnpm typecheck`, `pnpm test`, `pnpm build`, and `python -m pytest -q tests/`. The `pnpm lint` and `pnpm format:check` commands below are aspirational until scripts for them are defined; do not report them as passing unless they exist and run.

- [ ] All CI checks pass
- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] Static analysis/security checks pass in GitHub Actions
- [ ] HTML entry points satisfy `python3 scripts/verify_html_standards.py`
- [ ] Tests pass (`pnpm test`)
- [ ] Coverage ≥ 80% for new code
- [ ] E2E tests pass for UI changes
- [ ] Documentation updated if needed
- [ ] No breaking changes without major version bump

## 🏷️ Versioning

We use [Semantic Versioning](https://semver.org/). Releases are automated via `semantic-release`.

## 📝 Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
