export type AssetClass = 'comic' | 'trading_card' | 'video_game' | 'coin';

export type ProvenanceEventType = 
  | 'auction_sale' 
  | 'private_sale' 
  | 'asset_swap' 
  | 'grading_event'       // Initial raw grading process
  | 'reholder'            // Same company, new shell/label (e.g., old CGC label to custom label)
  | 'regrade'             // Cracked and re-evaluated (same company or cross-company crossover)
  | 'pedigree_discovery'
  | 'asset_merge'// Native support for physical asset identity consolidation;

export interface CurrencyAmount {
  amount: number;
  currency: string; // ISO 4217 protocol code (e.g., 'USD')
}

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

export interface SwappedAssetReference {
  /** The target spec asset URN if tracked in the local ecosystem */
  urn?: string;            
  /** Text description of the unindexed asset component involved in a trade */
  description: string;     
  /** Approximate financial worth estimation at the time of trade execution */
  estimatedValue?: CurrencyAmount;
}

export interface ProvenanceEvent {
  /** Unique runtime instance identifier */
  eventId: string;          
  eventType: ProvenanceEventType;
  /** ISO 8601 extended date schema representation (YYYY-MM-DD or YYYY-MM) */
  date: string;            
  /** Platform entity coordinating the transaction or service (e.g., 'Heritage Auctions', 'CGC') */
  platform?: string;       
  lotNumber?: string;
  sourceLink?: string;       
  /* Identity Consolidation Tracking */
  mergedUrn?: string;      // The retired duplicate URN that was absorbed
  notes?: string;          // e.g., "Identified as identical to raw record tracking URN X via unique cover alignment marks."
  /** Cash components directly cleared during the transaction step */
  financials?: CurrencyAmount; 
  pedigreeName?: string;   
  counterpartyFrom?: string; 
  counterpartyTo?: string;   
  /** Array of references populated strictly when handling 'asset_swap' actions */
  swappedAssets?: SwappedAssetReference[]; 
  
  /* Serialization Tracking (For 'reholder' and 'regrade' events) */
  /** The certification number that was retired or cracked open */
  previousCertNumber?: string; 
  /** The new certification number issued for the asset */
  newCertNumber?: string;      
  
  /** Detailed archival notation or provenance event commentary strings */
  notes?: string;            
}

export interface MarketMetrics {
  liquidityTier: 'A' | 'B' | 'C' | 'D';
  velocityIndex12m: number; 
  lastTradedPrice: CurrencyAmount;
}

export interface AltAssetBase {
  /** Structured resource protocol identifier (e.g., 'urn:altasset:comic:marvel:af15:cgc-12345678') */
  urn: string;             
  schemaVersion: string;   
  assetClass: AssetClass;
  /** The active authentication state and certification shell details */
  currentAuthentication: GradingAuthentication;
  /** Track every previous certification shell this exact physical asset has historically inhabited */
  historicalAuthentication?: GradingAuthentication[];
  provenanceLedger: ProvenanceEvent[];
  tags?: string[];           
  generalCommentary?: string;
  marketMetrics?: MarketMetrics;
  customMetadata: Record<string, any>; 
}
