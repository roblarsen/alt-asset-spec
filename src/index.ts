// Export all domain and core types
export * from './types/index.js';
import type { AltAssetBase } from './types/core.js';
import type { OriginalComicArtAsset } from './types/comicArt.js';

export type AltAsset = AltAssetBase | OriginalComicArtAsset;

// Export runtime validation engines
export { isAltAsset, validateProvenanceLedger } from './utils/validator.js';

// Export ledger and financial metrics utilities
export { getRecordHighSale, getAllAssociatedCertifications, mergeAssetIdentities } from './utils/ledgerUtils.js';