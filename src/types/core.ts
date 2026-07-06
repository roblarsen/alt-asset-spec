/**
 * Discriminator union representing the high-level category of a tracked alternative asset.
 * Each value maps to a distinct collector domain with its own grading ecosystem and market dynamics:
 * - `'comic'`: Printed comic books graded by services such as CGC or CBCS.
 * - `'trading_card'`: Sports and collectible trading cards graded by PSA, BGS, SGC, etc.
 * - `'video_game'`: Cartridge or disc-based video games graded by WATA or VGA.
 * - `'coin'`: Numismatic coins authenticated and graded by PCGS or NGC.
 */
export type AssetClass = 'comic' | 'trading_card' | 'video_game' | 'coin';

/**
 * Discriminator union enumerating every permissible provenance event kind recorded on the asset ledger.
 * Each variant has distinct semantic constraints on which sibling fields of {@link ProvenanceEvent} are required:
 * - `'auction_sale'`: Public auction clearance; expects `platform`, `lotNumber`, and `financials`.
 * - `'private_sale'`: Off-market bilateral transaction; expects `financials` and optional counterparty fields.
 * - `'asset_swap'`: Non-cash exchange; requires `swappedAssets` array instead of `financials`.
 * - `'grading_event'`: First-time professional encapsulation of a raw copy; expects `platform` (the grader).
 * - `'reholder'`: Same grading company issues a new slab/shell without re-evaluating the grade; expects
 *   `previousCertNumber` and `newCertNumber`.
 * - `'regrade'`: Slab cracked and asset re-evaluated, possibly by a different company (crossover); expects
 *   `previousCertNumber` and `newCertNumber`.
 * - `'pedigree_discovery'`: Asset formally attributed to a named collection pedigree; expects `pedigreeName`.
 * - `'asset_merge'`: Two tracked URNs confirmed to represent the same physical object; expects `mergedUrn`
 *   identifying the retired duplicate record.
 */
export type ProvenanceEventType = 
  | 'auction_sale' 
  | 'private_sale' 
  | 'asset_swap' 
  | 'grading_event'       // Initial raw grading process
  | 'reholder'            // Same company, new shell/label (e.g., old CGC label to custom label)
  | 'regrade'             // Cracked and re-evaluated (same company or cross-company crossover)
  | 'pedigree_discovery'
  | 'asset_merge' // Native support for physical asset identity consolidation;

/**
 * A monetary value paired with its ISO 4217 currency denomination.
 * Used throughout the spec wherever a financial figure must carry explicit currency context
 * (e.g., sale prices, estimated values, bid amounts).
 */
export interface CurrencyAmount {
  /** The numeric monetary quantity expressed in the major unit of the given currency (e.g., 1500.00 for $1,500 USD). */
  amount: number;
  /** ISO 4217 three-letter currency code identifying the denomination of `amount` (e.g., `'USD'`, `'EUR'`, `'GBP'`). */
  currency: string; // ISO 4217 protocol code (e.g., 'USD')
}

/**
 * Represents a single professional grading or authentication event for a physical asset,
 * capturing both the certifying entity and the resulting grade in multiple normalized forms.
 * An asset may accumulate multiple entries over its lifetime (reholders, regrades, crossovers);
 * only one entry should carry `isActive: true` at any given time.
 */
export interface GradingAuthentication {
  /** The authenticating entity (e.g., 'CGC', 'WATA', 'PSA', 'PCGS') */
  grader: string;          
  /** The unique grading identity registry/certification number */
  certNumber?: string;     
  /** * Normalized numeric grade value for linear sorting (e.g., 9.2, 10.0).
   * Optional to support legacy records that only feature descriptive or letter grades.
   */
  numericGrade?: number;    
  /** * The original unparsed grade string notation. 
   * Required as a fallback if numericGrade is undefined (e.g., "VF", "Fine/Very Fine", "A PRISTINE 10").
   */
  rawGradeString: string; 
  /** Condition or signature tracking qualifiers (e.g., ['Restored', 'Signature Series']) */
  qualifiers?: string[];   
  /** Identifies if this is the active current encapsulation configuration for the asset */
  isActive: boolean;
}

/**
 * A lightweight reference to an asset involved in the non-cash side of an `'asset_swap'` provenance event.
 * The referenced asset may or may not be formally tracked within the same ecosystem;
 * the `urn` field is therefore optional, while `description` is always required as a human-readable fallback.
 */
export interface SwappedAssetReference {
  /** The target spec asset URN if tracked in the local ecosystem */
  urn?: string;            
  /** Text description of the unindexed asset component involved in a trade */
  description: string;     
  /** Approximate financial worth estimation at the time of trade execution */
  estimatedValue?: CurrencyAmount;
}

/**
 * A single immutable entry in an asset's provenance ledger representing one discrete real-world event
 * that affected the asset's ownership, certification, condition classification, or identity.
 * The complete ordered array of `ProvenanceEvent` records on {@link AltAssetBase.provenanceLedger}
 * forms the authoritative chain-of-custody timeline for the physical object.
 *
 * Field applicability varies by `eventType`:
 * - Sales/swaps: `financials` or `swappedAssets` are expected.
 * - Reholder/regrade: `previousCertNumber` and `newCertNumber` are expected.
 * - Asset merge: `mergedUrn` is expected.
 * - Pedigree discovery: `pedigreeName` is expected.
 */
export interface ProvenanceEvent {
  /** Unique runtime instance identifier for this ledger entry; used as a stable reference key across systems. */
  eventId: string;          
  /**
   * The classification of this provenance record.
   * Drives validation rules for which sibling fields are required or forbidden.
   * See {@link ProvenanceEventType} for the full set of permitted values and their semantic contracts.
   */
  eventType: ProvenanceEventType;
  /** ISO 8601 extended date schema representation (YYYY-MM-DD or YYYY-MM) */
  date: string;            
  /** Platform entity coordinating the transaction or service (e.g., 'Heritage Auctions', 'CGC') */
  platform?: string;       
  /** Auction house lot identifier; populated for `'auction_sale'` events to enable direct catalogue cross-referencing. */
  lotNumber?: string;
  /** Canonical URL linking to a primary source document corroborating this event (auction result page, census entry, etc.). */
  sourceLink?: string;       
  /* Identity Consolidation Tracking */
  mergedUrn?: string;      // The retired duplicate URN that was absorbed
  notes?: string;          // e.g., "Identified as identical to raw record tracking URN X via unique cover alignment marks."
  /**
   * Cash components directly cleared during the transaction step.
   * Required for `'auction_sale'` and `'private_sale'` events; omitted for `'grading_event'`, `'reholder'`,
   * and `'asset_swap'` events where no direct monetary consideration changes hands.
   */
  financials?: CurrencyAmount; 
  /** The formal pedigree collection name attributed to the asset; populated for `'pedigree_discovery'` events (e.g., `'Mile High'`, `'White Mountain'`). */
  pedigreeName?: string;   
  /** Identity or handle of the party transferring ownership away from (seller or trader surrendering the asset). */
  counterpartyFrom?: string; 
  /** Identity or handle of the party receiving ownership (buyer or trader acquiring the asset). */
  counterpartyTo?: string;   
  /** Array of references populated strictly when handling 'asset_swap' actions */
  swappedAssets?: SwappedAssetReference[]; 
  
  /* Serialization Tracking (For 'reholder' and 'regrade' events) */
  /** The certification number that was retired or cracked open */
  previousCertNumber?: string; 
  /** The new certification number issued for the asset */
  newCertNumber?: string;      
             
}

/**
 * Quantitative secondary-market liquidity and trading activity metrics for an asset.
 * This block is optional on {@link AltAssetBase} and is intended to be populated by market-data
 * integrations rather than manually curated provenance workflows.
 */
export interface MarketMetrics {
  /**
   * Relative ease-of-liquidation tier derived from historical trading volume and bid-ask spread analysis.
   * Tiers rank from most liquid to least: `'A'` (highly liquid) → `'B'` → `'C'` → `'D'` (illiquid/thinly traded).
   */
  liquidityTier: 'A' | 'B' | 'C' | 'D';
  /** Rolling 12-month trade velocity index expressing how frequently comparable assets change hands; higher values indicate a more active market. */
  velocityIndex12m: number; 
  /** The most recently recorded cleared transaction price for this asset or a directly comparable copy. */
  lastTradedPrice: CurrencyAmount;
}

/**
 * Root record shape for any alternative asset tracked within the alt-asset specification.
 * Every concrete asset type (comic, trading card, video game, coin) extends or conforms to this base
 * interface, which mandates the fields required to establish a unique, authenticated, and provenance-backed
 * asset identity.
 */
export interface AltAssetBase {
  /**
   * Immutable unique primary key for this asset record expressed as a structured URN (Uniform Resource Name).
   * Must follow the colon-separated format `urn:altasset:<assetClass>:<publisher/brand>:<title-key>:<cert-id>`
   * (e.g., `'urn:altasset:comic:marvel:af15:cgc-12345678'`).
   * Once assigned this value must never be mutated; identity merges are handled via `'asset_merge'` provenance events.
   */
  urn: string;             
  /** Semantic version string identifying the revision of the alt-asset schema this record conforms to (e.g., `'1.0.0'`). Used for forward-compatibility checks during deserialization. */
  schemaVersion: string;   
  /**
   * High-level collector domain classification for this asset.
   * Drives asset-class-specific validation rules and determines which extended interface (comic, trading card, etc.)
   * the record should additionally satisfy. See {@link AssetClass} for permitted values.
   */
  assetClass: AssetClass;
  /** The active authentication state and certification shell details */
  currentAuthentication: GradingAuthentication;
  /** Track every previous certification shell this exact physical asset has historically inhabited */
  historicalAuthentication?: GradingAuthentication[];
  /**
   * Strict sequential timeline array capturing every discrete provenance transaction, condition shift,
   * and authentication milestone in chronological order.
   * This ledger is the single source of truth for the asset's chain-of-custody and must never have entries
   * deleted or reordered; corrections are appended as new events with explanatory `notes`.
   */
  provenanceLedger: ProvenanceEvent[];
  /** Free-form classification or search labels applied to this asset for organizational or filtering purposes (e.g., `['key-issue', 'signature-series', 'investment-grade']`). */
  tags?: string[];           
  /** Unstructured narrative field for analyst commentary, collector notes, or contextual observations that do not fit into structured fields. */
  generalCommentary?: string;
  /** Optional secondary-market liquidity and pricing metrics block; populated by market-data integrations and absent when no trading data is available. */
  marketMetrics?: MarketMetrics;
  /** Required extensible dictionary for asset-class-specific or integration-specific metadata that falls outside the core schema. Keys and value shapes are implementation-defined; consumers should not rely on this field for core business logic. Pass an empty object `{}` when no custom metadata applies. */
  customMetadata: Record<string, any>; 
}
