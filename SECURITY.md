# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this codebase, please report it
privately rather than opening a public issue.

**Preferred channel:**
[Open a private security advisory on GitHub](https://github.com/siddhartha-kumar/professional-portfolio/security/advisories/new)

**Alternate:**
Email `shivsiddhartha187@hotmail.com` with subject prefix `[security]`.

You can expect:

- Acknowledgement within **7 days**
- A detailed response (assessment + remediation timeline) within **30 days**
- Coordinated public disclosure once a fix is deployed

Please **do not** disclose the issue publicly until a fix has shipped.

## Scope

This repository is a static Next.js portfolio website deployed on Vercel.
There is no backend service, no authentication layer, and no user data
collection beyond standard Vercel analytics.

The most likely classes of security issues are:

- **Supply-chain** — vulnerable npm transitive dependencies (handled by
  Dependabot security updates + weekly upgrade PRs)
- **Secret leakage** — accidentally committed API keys or tokens (handled
  by GitHub Secret Scanning + push protection)
- **Build-time injection** — malicious code reaching the published bundle
  via a compromised dependency

Out of scope:

- Issues in the rendered HTML caused by browser bugs
- Denial-of-service via repeated requests (Vercel handles rate limiting)
- Social-engineering attacks against the maintainer

## Hardening already in place

- All commits on `main` and `dev` are **GPG/SSH signed** and verified by GitHub
- Branch protection prevents direct pushes, force pushes, and deletions
- Required CI status checks must pass before merge
- Dependabot raises PRs for vulnerable dependencies automatically
- Secret scanning + push protection block credential leaks at the API
