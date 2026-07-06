# Repository LLM Context: Alternative Asset Specification (`@roblarsen/alt-asset-spec`)

This package is a strict, type-safe open data specification and validation engine for alternative assets, pedigrees, and high-value collectibles.

## Core Architectural Boundaries
- **Zero External Dependencies:** This package must remain entirely unbloated and zero-dependency. Do not import third-party validation frameworks (e.g., Zod, Yup). Everything is implemented via native TypeScript type guards.
- **Pure Module Exposing:** Source layouts are written under pure ES Modules (`type: module`). All internal imports must maintain absolute relative resolution tracking with trailing extensions (e.g., `import { Type } from './core.js';`).

## Spec Invariant Constraints
1. **Immutable Identifiers:** Every asset requires a canonical, un-spaced Uniform Resource Name (`urn`) acting as its primary key.
2. **Timeline Integrity:** Historical changes, transactions, and gradings must be logged sequentially inside the `provenanceLedger` array.
3. **Context Isolation:** Non-transactional milestones (like `regrade` or `reholder` events) must never inject an empty or zeroed `financials` payload block; omit the object entirely.
