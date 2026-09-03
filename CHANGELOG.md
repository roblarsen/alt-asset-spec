# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-09-03

### Added
- Expanded the alternative asset schema to better model complex provenance, grading history, and liquidity metadata.
- Added support for additional asset domains including original art and video game records.
- Introduced richer provenance event fields such as source links, merged URNs, notes, financials, pedigree names, counterparty details, asset swaps, and serialization tracking.
- Added market metrics support for tracking liquidity tier, 12-month velocity, and last traded price.
- Added stronger runtime validation helpers for asset records and provenance ledgers.
- Added updated fixtures and tests covering comic art, pedigree tracking, regrade flows, and asset validation behavior.

### Changed
- Updated the package version to 1.1.0.
- Refined the core asset model to require a schema version, provenance ledger, and extensible custom metadata.
- Improved README examples and development scripts to reflect the current TypeScript/Vitest workflow.

### Fixed
- Tightened validation around provenance event shape checks and core asset structure.

## [1.0.0] - 2026-09-03

### Added
- Initial release of `alt-asset-spec`.
- Base alternative asset schema and TypeScript interfaces.
- Runtime type guard and provenance ledger validation utilities.
- Comic asset fixtures and tests.
