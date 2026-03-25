---
description: Audit npm dependencies for vulnerabilities, outdated packages, and license issues
---

# Dependency Audit Command

Comprehensive dependency audit covering security, outdated packages, and license compliance.

## Audit Process

### 1. Vulnerability Scan
Run `npm audit --json` and report by severity:
- **CRITICAL** — Immediate action, may block deployment
- **HIGH** — Fix before next release
- **MODERATE** — Fix within current sprint

For each: package name, CVE, attack vector, upgrade path

### 2. Outdated Packages
Run `npm outdated`. Flag if > 1 major version behind for:
`express`, `jsonwebtoken`, `bcrypt`, `@prisma/client`, `zod`, `helmet`

### 3. License Compliance
- **Allowed**: MIT, ISC, Apache-2.0, BSD-2-Clause, BSD-3-Clause
- **Review required**: LGPL, MPL
- **Not allowed** (commercial): GPL, AGPL, SSPL

### 4. Unused Dependencies
Check `package.json` against `src/` imports. Flag unimported packages.

### 5. Lockfile Integrity
- `bun.lockb` or `package-lock.json` must be committed

## Output Format

```
## Dependency Audit Report
### Summary
- Vulnerabilities: X critical, X high, X moderate
- Outdated: X packages
- License issues: X flagged

### Vulnerabilities
#### 🟥 [CRITICAL] package@version — CVE-XXXX
- Attack vector: Network
- Fix: npm install package@x.x.x

### Outdated Packages
| Package | Installed | Latest | Priority |

### Unused Dependencies
- package-name — not imported in src/
```

## Usage

```
/dependency-audit
```
