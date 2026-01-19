# React2Shell (CVE-2025-55182) Vulnerability Assessment

**Assessment Date**: January 19, 2026  
**Repository**: babylonlabs-io/babylonlabs.github.io  
**Assessed By**: Security Analysis

---

## Executive Summary

**VERDICT: ✅ NOT VULNERABLE**

This repository is **NOT vulnerable** to the React2Shell (CVE-2025-55182) vulnerability.

---

## Vulnerability Overview

### What is React2Shell (CVE-2025-55182)?

React2Shell is a critical remote code execution (RCE) vulnerability with a CVSS score of 10.0 (maximum severity). It affects:

- **React Server Components (RSC)** in React 19.0.0 through 19.2.0
- **Next.js** Canary builds ≥14.3.0-canary.77, versions 15.x, and 16.x up to 16.0.7
- **NPM packages**: `react-server-dom-webpack`, `react-server-dom-turbopack`, `react-server-dom-parcel`

The vulnerability allows attackers to execute arbitrary code on the server by sending a single malicious HTTP request exploiting insecure deserialization in the React Flight protocol used by Server Components.

---

## Assessment Findings

### 1. React Version Analysis

**Current React Version**: 18.3.1

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

**Installed Version** (from package-lock.json):
```json
"react": {
  "version": "18.3.1"
}
```

✅ **Status**: React 18.x is NOT affected. The vulnerability only affects React 19.0.0 through 19.2.0.

---

### 2. Framework Analysis

**Framework**: Docusaurus 3.7 (Static Site Generator)

This repository uses Docusaurus, which is:
- A **Static Site Generator (SSG)** that generates static HTML files at build time
- Built on React 18 for client-side interactivity only
- Does NOT use React Server Components (RSC)
- Does NOT use the React Flight protocol
- Does NOT have server-side rendering with React 19 features

✅ **Status**: Docusaurus architecture is fundamentally incompatible with the vulnerability vector.

---

### 3. Next.js Usage Check

**Result**: Next.js is NOT used in this project.

✅ **Status**: Not applicable.

---

### 4. Vulnerable Package Check

**Checked for**:
- `react-server-dom-webpack`
- `react-server-dom-turbopack`
- `react-server-dom-parcel`
- `next`

**Result**: None of these packages are present in package.json or package-lock.json.

✅ **Status**: No vulnerable packages detected.

---

### 5. Server Components Usage Check

**Searched for**: `"use server"` directive in source code

**Result**: No React Server Components detected in the codebase.

✅ **Status**: Server Components are not used.

---

## Technical Details

### Why This Repository is Safe

1. **React Version**: Uses React 18.3.1, which predates the vulnerability (affects only React 19.x)

2. **Static Architecture**: Docusaurus generates static HTML at build time:
   - No server-side React rendering at request time
   - No dynamic server-side code execution
   - React only runs in the browser for client-side interactivity

3. **No RSC Dependencies**: The application doesn't use any of the vulnerable `react-server-dom-*` packages

4. **No Server Components**: The codebase doesn't use the `"use server"` directive or React Server Components API

5. **No Next.js**: Not using Next.js, which is one of the primary frameworks affected

---

## Recommendations

### Current Status: No Action Required

The repository is not vulnerable to React2Shell. However, for ongoing security:

### 1. Future React Upgrades ⚠️

If upgrading to React 19 in the future:
- **AVOID** React 19.0.0 through 19.2.0
- **USE** React 19.0.1, 19.1.2, or 19.2.1 or later (patched versions)
- Verify no Server Components are introduced unless absolutely necessary

### 2. Dependency Monitoring 🔍

Continue monitoring for:
- Security advisories from Docusaurus
- React security updates
- Automated dependency scanning with tools like:
  - GitHub Dependabot (already enabled)
  - npm audit
  - Snyk or similar tools

### 3. Build-time Security 🛡️

Since this is a static site:
- Continue current practice of pre-generating all content at build time
- Avoid introducing server-side rendering or Server Components
- Maintain the current Docusaurus SSG architecture

### 4. Regular Audits 📋

- Run `npm audit` regularly
- Keep dependencies up to date
- Review security advisories for React ecosystem

---

## References

- **CVE**: CVE-2025-55182
- **CVSS Score**: 10.0 (Critical)
- **Affected Versions**: React 19.0.0 - 19.2.0, Next.js 14.3.0-canary.77+, 15.x, 16.x (up to 16.0.7)
- **Patched Versions**: React 19.0.1, 19.1.2, 19.2.1+; Next.js 15.0.5+, 15.1.9+, 15.3.6+, 15.4.8+, 15.5.7+, 16.0.7+

### Additional Resources

- [Microsoft Security Blog - React2Shell](https://www.microsoft.com/en-us/security/blog/2025/12/15/defending-against-the-cve-2025-55182-react2shell-vulnerability-in-react-server-components/)
- [CISA KEV Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [React Security Advisory](https://github.com/facebook/react/security/advisories)

---

## Conclusion

**The babylonlabs.github.io repository is NOT vulnerable to React2Shell (CVE-2025-55182).**

The application uses:
- React 18.3.1 (not affected)
- Docusaurus SSG architecture (no server-side React rendering)
- No React Server Components
- No vulnerable dependencies

**Risk Level**: None  
**Action Required**: None  
**Recommendation**: Continue current security practices and monitor for future advisories.

---

*This assessment was conducted on January 19, 2026, based on the current state of the repository.*
