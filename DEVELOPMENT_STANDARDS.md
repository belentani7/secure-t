# Secure T — Development and UI Standards

**Status:** normative repository baseline for new work and every file changed by a pull request. Existing legacy pages are brought into compliance incrementally; do not claim whole-repository compliance until the complete tree has been audited.

## 1. Authoritative references

- **HTML:** WHATWG HTML Living Standard — https://html.spec.whatwg.org/
- **Accessibility:** W3C WCAG 2.2, target level AA — https://www.w3.org/TR/WCAG22/
- **Web application security:** OWASP ASVS (use the current stable release appropriate to the feature) — https://owasp.org/www-project-application-security-verification-standard/
- **Secure development lifecycle:** NIST SP 800-218, Secure Software Development Framework — https://csrc.nist.gov/pubs/sp/800/218/final
- **Commit convention:** Conventional Commits — https://www.conventionalcommits.org/
- **Versioning:** Semantic Versioning — https://semver.org/

These are engineering baselines, not a claim of certification or legal compliance.

## 2. SECURE T identity

- Brand name is **SECURE T**; use the same wordmark and tone across the public landing page, campus, academy, error pages, metadata and documentation.
- Visual direction: deep forest-black surfaces, high-contrast warm electric green accent, restrained grid/terminal details, no unrelated blue/purple primary accents.
- Core accent: `#B8F36B`; page background: `#07130D`; foreground must remain readable against both.
- Use shared tokens in `campus/tokens.css` and institutional rules in `ui/institutional.css`; avoid hard-coded one-off palettes when a token exists.
- Do not imply official accreditation, real-time monitoring, real security actions, live threat data, or deployed functionality unless independently verified. Label simulations clearly.

## 3. HTML and accessibility

- Use a valid doctype, a correct `lang`, UTF-8, responsive viewport, descriptive page title, meaningful meta description where appropriate, and one clear primary `h1`.
- Use semantic landmarks and a skip link on content-heavy pages. Keep heading levels hierarchical.
- Give informative images useful alternative text; decorative images must use empty alt text or be hidden from assistive technology.
- Every interactive control must have an accessible name, keyboard operation and a visible focus state. Do not convey status using color alone.
- Respect `prefers-reduced-motion`; maintain readable contrast (WCAG AA target) and responsive layouts at narrow widths.
- Use unique IDs and valid label/control relationships. Prefer native HTML before custom ARIA.

## 4. Security and privacy

- Validate untrusted input at trust boundaries; encode output for its context; use parameterized database access.
- Never commit credentials, tokens, private user data, or production secrets. Keep secrets in deployment secret stores and scan published artifacts.
- Apply least privilege to GitHub Actions; pin and review third-party actions, keep dependencies maintained, and retain security tests for auth, authorization, input validation and headers.
- Collect no data unless a documented feature requires it. Be explicit about local-only storage, simulations, and network behavior.
- Do not weaken CSP, transport security, authentication or authorization to make a test pass. Document any exception with owner, rationale and expiry.

## 5. Change and release workflow

1. Create a focused branch; never use direct-to-production edits for broad changes.
2. Keep generated output synchronized from its source; do not hand-edit generated mirrors unless the build contract explicitly requires it.
3. Use Conventional Commits and small reviewable changes.
4. Run the applicable type checks, unit/integration tests, static security checks and production build. For HTML/UI changes, run the HTML standards smoke check and relevant browser/accessibility tests.
5. Review the actual deployment and its logs after release; a successful commit is not proof of a successful production deployment.
6. Document limitations and evidence. Never label the repository “green” unless the required checks have passed.

## 6. Definition of done

- The change matches the brand system and preserves existing behavior.
- Accessibility, privacy, security and responsive behavior are considered and tested.
- Documentation reflects actual implemented behavior.
- CI checks are green, or failures are explicitly listed with evidence and owners.
