# Repository LLM Context: Alternative Asset Specification (`@roblarsen/alt-asset-spec`)

This package is a strict, type-safe open data specification and validation engine for alternative assets, pedigrees, and high-value collectibles.

## Core Architectural Boundaries
- **Zero External Dependencies:** This package must remain entirely unbloated and zero-dependency. Do not import third-party validation frameworks (e.g., Zod, Yup). Everything is implemented via native TypeScript type guards.
- **Pure Module Exposing:** Source layouts are written under pure ES Modules (`type: module`). All internal imports must maintain absolute relative resolution tracking with trailing extensions (e.g., `import { Type } from './core.js';`).

## Spec Invariant Constraints
1. **Immutable Identifiers:** Every asset requires a canonical, un-spaced Uniform Resource Name (`urn`) acting as its primary key.
2. **Timeline Integrity:** Historical changes, transactions, and gradings must be logged sequentially inside the `provenanceLedger` array.
3. **Context Isolation:** Non-transactional milestones (like `regrade` or `reholder` events) must never inject an empty or zeroed `financials` payload block; omit the object entirely.

## Pull Request Governance Requirements (ACM v1.1)
- For every implementation or refactor output, include an Assumptions & Constraints Manifest (ACM v1.1) block in the PR description.
- ACM blocks must use exact delimiters: `<!-- ACM-START -->` and `<!-- ACM-END -->`.
- Manifest frontmatter must use typed contract statuses (`guaranteed`, `conditional`, `unsupported`, `not_applicable`, `unknown`) and distributed primitives.
- Any `guaranteed` contract must include concrete evidence; any `conditional` contract must include conditions; unsupported/unknown boundaries must be explicitly documented.
