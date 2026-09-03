/**
 * Discriminator union representing the high-level category of a tracked alternative asset.
 * Each value maps to a distinct collector domain with its own grading ecosystem and market dynamics:
 * - `'comic'`: Printed comic books graded by services such as CGC or CBCS.
 * - `'original_art'`: One-of-a-kind physical production art boards (pages, splashes, covers).
 * - `'trading_card'`: Sports and collectible trading cards graded by PSA, BGS, SGC, etc.
 * - `'video_game'`: Cartridge or disc-based video games graded by WATA or VGA.
 * - `'coin'`: Numismatic coins authenticated and graded by PCGS or NGC.
 */
export type AssetClass = 
  | 'comic' 
  | 'original_art' 
  | 'trading_card' 
  | 'video_game' 
  | 'coin';

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
 * - `'exhibition'`: Formal public museum or gallery showing of the piece; expects `platform` (venue) and `notes`.
 * - `'asset_split'`: A multi-page story, sketchbook, or complete intact book was disassembled into individual lots;
 *   expects `notes` detailing the resulting component assets.
 * - `'asset_merge'`: Two tracked URNs confirmed to represent the same physical object; expects `mergedUrn`
 *   identifying the retired duplicate record.
 */
export type ProvenanceEventType = 
  | 'auction_sale' 
  | 'private_sale' 
  | 'asset_swap' 
  | 'grading_event' 
  | 'reholder' 
  | 'regrade' 
  | 'pedigree_discovery'
  | 'exhibition'
  | 'asset_split'
  | 'asset_merge';

/**
 * A monetary value paired with its ISO 4217 currency denomination.
 * Used throughout the spec wherever a financial figure must carry explicit currency context
 * (e.g., sale prices, estimated values, bid amounts).
 */
export interface CurrencyAmount {
  /** The numeric monetary quantity expressed in the major unit of the given currency (e.g., 1500.00 for $1,500 USD). */
  amount: number;
  /** ISO 4217 three-letter currency code identifying the denomination of `amount` (e.g., `'USD'`, `'EUR'`, `'GBP'`). */
  currency: string;
}

/**
 * Represents a single professional grading or authentication event for a physical asset,
 * capturing both the certifying entity and the resulting grade in multiple normalized forms.
 * An asset may accumulate multiple entries over its lifetime (reholders, regrades, crossovers);
 * only one entry should carry `isActive: true` at any given time.
 */
export interface GradingAuthentication {
  /** The authenticating entity (e.g., 'CGC', 'WATA', 'PSA', 'PCGS', or registry like 'CAF') */
  grader: string;          
  /** The unique grading identity registry/certification number */
  certNumber?: string;     
  /**
   * Normalized numeric grade value for linear sorting (e.g., 9.2, 10.0).
   * Optional to support legacy records that only feature descriptive or letter grades.
   */
  numericGrade?: number;    
  /**
   * The original unparsed grade string notation. 
   * Required as a fallback if numericGrade is undefined (e.g., "VF", "Fine/Very Fine", "A PRISTINE 10").
   */
  rawGradeString: string; 
  /** Condition or signature tracking qualifiers (e.g., ['Restored', 'Signature Series', 'Stan Lee Inscribed']) */
  qualifiers?: string[];   
  /** Identifies if this is the active current encapsulation configuration for the asset */
  isActive: boolean;
  /** Contextual notes regarding condition, repairs, or grader comments */
  notes?: string;
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
 */
export interface ProvenanceEvent {
  /** Unique runtime instance identifier for this ledger entry; used as a stable reference key across systems. */
  eventId: string;          
  /**
   * The classification of this provenance record.
   * Drives validation rules for which sibling fields are required or forbidden.
   */
  eventType: ProvenanceEventType;
  /** ISO 8601 extended date schema representation (YYYY-MM-DD or YYYY-MM) */
  date: string;            
  /** Platform entity coordinating the transaction, exhibit, or service (e.g., 'Heritage Auctions', 'Sotheby\'s', 'CGC') */
  platform?: string;       
  /** Auction house lot identifier; populated for `'auction_sale'` events to enable direct catalogue cross-referencing. */
  lotNumber?: string;
  /** Canonical URL linking to a primary source document corroborating this event (auction result page, census entry, etc.). */
  sourceLink?: string;       
  /** The retired duplicate URN that was absorbed in an `'asset_merge'` event */
  mergedUrn?: string;      
  /** Unstructured commentary detailing the event, condition notes, or historical context */
  notes?: string;          
  /**
   * Cash components directly cleared during the transaction step.
   * Required for sale events; omitted for non-monetary milestones (grading, exhibits, reholders).
   */
  financials?: CurrencyAmount; 
  /** The formal pedigree collection name attributed to the asset; populated for `'pedigree_discovery'` events. */
  pedigreeName?: string;   
  /** Identity or handle of the party transferring ownership away from (seller or trader surrendering the asset). */
  counterpartyFrom?: string; 
  /** Identity or handle of the party receiving ownership (buyer or trader acquiring the asset). */
  counterpartyTo?: string;   
  /** Array of references populated strictly when handling `'asset_swap'` actions */
  swappedAssets?: SwappedAssetReference[]; 
  
  /* Serialization Tracking (For 'reholder' and 'regrade' events) */
  /** The certification number that was retired or cracked open */
  previousCertNumber?: string; 
  /** The new certification number issued for the asset */
  newCertNumber?: string;      
}

/**
 * Quantitative secondary-market liquidity and trading activity metrics for an asset.
 */
export interface MarketMetrics {
  /** Relative ease-of-liquidation tier: `'A'` (liquid) → `'D'` (illiquid/thinly traded). */
  liquidityTier: 'A' | 'B' | 'C' | 'D';
  /** Rolling 12-month trade velocity index expressing market frequency. */
  velocityIndex12m: number; 
  /** The most recently recorded cleared transaction price for this asset or a directly comparable copy. */
  lastTradedPrice: CurrencyAmount;
}

/**
 * Root record shape for any alternative asset tracked within the alt-asset specification.
 */
export interface AltAssetBase {
  /**
   * Immutable unique primary key for this asset record expressed as a structured URN.
   * Format: `urn:altasset:<assetClass>:<domain-namespace>:<asset-identity>:<instanceId>`
   */
  urn: string;              
  /** Semantic version string identifying the schema revision (e.g., `'1.1.0'`). */
  schemaVersion: string;   
  /** High-level collector domain classification. */
  assetClass: AssetClass;
  /** Active authentication state and certification shell details; optional for uncertified raw or fine-art items. */
  currentAuthentication?: GradingAuthentication;
  /** Previous certification shells this exact physical asset has historically inhabited. */
  historicalAuthentication?: GradingAuthentication[];
  /**
   * Strict sequential timeline array capturing every discrete provenance transaction, condition shift,
   * exhibit, and authentication milestone in chronological order.
   */
  provenanceLedger: ProvenanceEvent[];
  /** Free-form classification or search labels applied to this asset (e.g., `['twice-up', 'key-issue', 'kirby']`). */
  tags?: string[];           
  /** Unstructured narrative field for analyst commentary or collector notes. */
  generalCommentary?: string;
  /** Optional secondary-market liquidity and pricing metrics block. */
  marketMetrics?: MarketMetrics;
  /** Extensible dictionary for class-specific or integration-specific metadata. */
  customMetadata: Record<string, any>; 
}

/* ==========================================================================
   Original Comic Art Domain Extensions
   ========================================================================== */

/**
 * Structural classification of the physical production artwork board.
 */
export type ArtWorkType = 
  | 'interior_page'
  | 'splash'
  | 'spread'
  | 'cover'
  | 'pinup'
  | 'thumbnail'
  | 'complete_story'
  | 'complete_book';

/**
 * Physical drafting sizing and material formats.
 */
export type PhysicalFormat = 
  | 'twice_up'        // Standard Golden/Silver Age pre-1967 production sizing
  | 'standard_modern' // Post-1967 ~11x17 inch boards
  | 'sketch'
  | 'layout';

/**
 * Attribution of creative contribution to the physical art board.
 */
export interface CreatorCredit {
  /** Full name of the creator (e.g., 'Jack Kirby', 'Steve Ditko') */
  name: string;
  /** Creative role executed on this specific board */
  role: 'pencils' | 'inks' | 'pencils_and_inks' | 'layouts' | 'colors' | 'letters';
}

/**
 * Relational link tying the physical production art back to its printed publication target.
 */
export interface PublicationTarget {
  /** Publisher name (e.g., 'Marvel Comics', 'DC Comics') */
  publisher: string;
  /** Canonical series title (e.g., 'Tales of Suspense', 'Daredevil') */
  seriesTitle: string;
  /** Issue number in which this artwork was intended to be or was published */
  issueNumber: number;
  /** Estimated or confirmed cover/publication date in ISO format (e.g., '1964-04') */
  publicationDate?: string;
  /** Story title or segment name (e.g., 'The Vengeance of Loki!', 'The Human Torch') */
  storyTitle?: string;
  /** Sequential story page numbers represented on this board (e.g., [8, 9] for spreads, [1] for splash) */
  storyPageNumbers: number[];
  /** Flag identifying if the art belongs to a secondary/backup feature rather than the lead title */
  isBackupStory?: boolean;
}

/**
 * Concrete record specification for unique physical comic book production art.
 */
export interface OriginalComicArtAsset extends AltAssetBase {
  assetClass: 'original_art';
  
  /** Detailed publication context anchoring this piece to printed comic history */
  publicationTarget: PublicationTarget;

  /** Physical and artistic attributes of the piece */
  artDetails: {
    workType: ArtWorkType;
    physicalFormat?: PhysicalFormat;
    creators: CreatorCredit[];
    medium?: string[];              // e.g., ['ink', 'graphite', 'wash', 'blue-pencil']
    hasProductionNotes?: boolean;   // e.g., Stan Lee margin notes or editorial stamps
  };

  /**
   * High-level survival status for the artwork:
   * - `'verified'`: Board exists, authenticated, and has documented chain of custody.
   * - `'complete_intact'`: Represents a multi-page story or complete book that remains bound/together.
   * - `'dispersed'`: Formerly intact complete run that has since broken into separate individual lots.
   * - `'unconfirmed'`: Rumored or uncorroborated physical survival.
   */
  survivalStatus: 'verified' | 'complete_intact' | 'dispersed' | 'unconfirmed';
}

/**
 * Top-level union representing any valid alt-asset instance.
 */
export type AltAsset = AltAssetBase | OriginalComicArtAsset;
