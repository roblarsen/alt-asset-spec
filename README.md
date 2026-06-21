# alt-asset-spec

An open-source, industrial-strength TypeScript data specification and runtime validation engine for alternative assets graded by third-party services.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![ES Modules](https://img.shields.io/badge/modules-ESM-blue)

---

## The Philosophy

This specification grew from ongoing work with third party graded comic books and represents a desire to move from ad hoc data structures to something more structured and flexible. 

Traditional tracking schemas for alternative assets fail at the high end because they conflate the **ephemeral container** (the third-party encapsulation shell/serial number) with the **immutable underlying physical asset**. This schema enforces a strict separation: a physical asset stays uniform via a persistent internal URN, while tracking dynamic real-world events like intra-company regrades, corporate crossovers, reholders, private trades, and asset-for-asset swaps.

## Features

* **Strict Type Definitions:** Complete TypeScript interfaces modeling asset primitives, currency matrices, and third-party grading certifications (`CGC`, `PSA`, `WATA`, `PCGS`, etc.).
* **Decoupled Architecture:** Core primitives scale across multiple domains (`comic`, `trading_card`, `video_game`, `coin`) without duplicating schema foundations.
* **Runtime Validation:** Native type guards to ensure messy, incoming web-scraped auction data or JSON streams comply with the specification boundaries before hitting your database.
* **Provenance Ledger Engine:** Built natively to handle complex asset lifecycles, tracking changes in serialization (`previousCertNumber` ➔ `newCertNumber`) alongside financial velocity indices.

---

## Architecture Blueprint

```
       [ Core AltAssetBase Wrapper ]
                     │
     ┌───────────────┴───────────────┐
     ▼                               ▼
[ currentAuthentication ]    [ historicalAuthentication[] ]
  (Active Cert/Holder)         (Retired Holders/Slabs Ledger)
     │                               │
     └───────────────┬───────────────┘
                     ▼
          [ provenanceLedger[] ]
  (Sales, Asset Swaps, Regrades, Reholders)
```

---

## Installation

```bash
npm install alt-asset-spec
```

## Quick Start

### 1. Enforcing Type Safety (Compile-Time)

```typescript
import { AltAssetComic } from 'alt-asset-spec';

const churchSuperman: AltAssetComic = {
  urn: 'urn:altasset:comic:dc:superman:1:edgar-church-copy',
  schemaVersion: '1.0.0',
  assetClass: 'comic',
  currentAuthentication: {
    grader: 'CGC',
    numericGrade: 8.5,
    rawGradeString: '8.5 Very Fine',
    isActive: true
  },
  provenanceLedger: [
    {
      eventId: 'evt_sale_2026',
      eventType: 'private_sale',
      date: '2026-02-05',
      platform: 'Heritage Auctions',
      financials: { amount: 7000000, currency: 'USD' }
    }
  ],
  customMetadata: {
    publisher: 'DC',
    title: 'Superman',
    issueNumber: '1',
    publicationDate: '1939-06'
  }
};
```

### 2. Runtime Ingestion Guarding

Validate untrusted JSON data payloads (e.g., streaming from web scrapers or external APIs) before mutating data:

```typescript
import { isAltAsset, validateProvenanceLedger } from 'alt-asset-spec';

const incomingData = await fetchExternalAuctionPayload();

if (isAltAsset(incomingData)) {
  const ledgerStatus = validateProvenanceLedger(incomingData.provenanceLedger);
  if (!ledgerStatus.isValid) {
    console.error('Ledger errors detected:', ledgerStatus.errors);
  }
}
```

---

## Development & Contribution

### Repository Scripts

* `npm run build` - Compiles the source TypeScript, generating ESM distributions and `.d.ts` declarations to `/dist`.
* `npm run test` - Executes the unit testing suite via Vitest against historical asset benchmarks (including the Church *Superman* #1).
* `npm run typecheck` - Compiles the codebase without emitting artifacts to run strict type checks.

## License

Distributed under the MIT License. See `LICENSE` for more information.
