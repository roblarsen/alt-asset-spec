export type AssetClass = 'comic' | 'trading_card' | 'video_game' | 'coin';

export type ProvenanceEventType = 
  | 'auction_sale' 
  | 'private_sale' 
  | 'asset_swap' 
  | 'grading_event' 
  | 'pedigree_discovery';

export interface CurrencyAmount {
  amount: number;
  currency: string; // ISO 4217 protocol code (e.g., 'USD')
}

export interface GradingAuthentication {
  /** The authenticating entity (e.g., 'CGC', 'PCGS', 'PSA', 'WATA') */
  grader: string;          
  /** The unique grading identity registry/certification number */
  certNumber?: string;     
  /** Normalized numeric grade value for linear algorithmic sorting (e.g., 9.2, 10.0) */
  numericGrade?: number;    
  /** Original unparsed raw grade notation output by the browser scraper scripts */
  rawGradeString?: string; 
  /** Condition or signature tracking qualifiers (e.g., ['Restored', 'Signature Series']) */
  qualifiers?: string[];   
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
  /** Platform entity coordinating the transaction (e.g., 'Heritage Auctions') */
  platform?: string;       
  lotNumber?: string;
  sourceLink?: string;       
  /** Cash components directly cleared during the transaction step */
  financials?: CurrencyAmount; 
  pedigreeName?: string;   
  counterpartyFrom?: string; 
  counterpartyTo?: string;   
  /** Array of references populated strictly when handling 'asset_swap' actions */
  swappedAssets?: SwappedAssetReference[]; 
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
  authentication: GradingAuthentication;
  provenanceLedger: ProvenanceEvent[];
  tags?: string[];           
  generalCommentary?: string;
  marketMetrics?: MarketMetrics;
  customMetadata: Record<string, any>; 
}