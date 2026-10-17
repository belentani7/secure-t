# Security: Credential Rotation

## Context
Issue #6 detected exposed credentials that should be rotated.

## Actions Required
1. **Rotate all exposed credentials** (passwords, API keys, tokens)
2. **Regenerate GitHub PAT** with minimal scopes (`repo`, `workflow`)
3. **Check for credentials in**:
   - `.env` files in git history
   - Docker images pushed to registries
   - Build logs
   - CI secrets

## How to check
```bash
# Scan current tree
gitleaks git --config .gitleaks.toml --log-opts="--all" --redact --verbose

# Scan historical commits
gitleaks git --config .gitleaks.toml --log-opts="--all" --no-git-scan
```

## Prevention
- `.env.example` only for templates
- GitHub Secrets for all credentials
- Gitleaks runs in CI (configured in `.github/workflows/ci.yml`)
- Dependabot auto-updates to patch vulnerable deps
