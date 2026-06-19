import { AltAssetBase } from './core.js';

export interface CardMetadata {
  manufacturer: string;    // e.g., 'Upper Deck', 'Wizards of the Coast', 'Topps'
  set: string;             // e.g., '1999 Base Set'
  cardName: string;        // e.g., 'Charizard'
  cardNumber: string;      // e.g., '4/102'
  isAutographed: boolean;
}

export interface AltAssetCard extends AltAssetBase {
  assetClass: 'trading_card';
  customMetadata: CardMetadata;
}