import { AltAssetBase } from './core.js';

export interface CoinMetadata {
  country: string;         // e.g., 'United States'
  denomination: string;    // e.g., 'One Dollar'
  year: number;
  mintMark?: string;       // e.g., 'CC' (Carson City), 'D'
  variety?: string;        // e.g., 'Morgan VAM-1A'
  metalContent: string;    // e.g., '90% Silver'
}

export interface AltAssetCoin extends AltAssetBase {
  assetClass: 'coin';
  customMetadata: CoinMetadata;
}