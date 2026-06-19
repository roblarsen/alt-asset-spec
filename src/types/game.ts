import { AltAssetBase } from './core.js';

export interface GameMetadata {
  platform: string;        // e.g., 'Nintendo NES', 'Sega Genesis'
  title: string;           // e.g., 'Super Mario Bros.'
  releaseYear: number;
  boxVariant?: string;     // e.g., '3-Oval TM Seal', 'Hangtab'
  sealRating?: string;     // e.g., 'A++', 'A' (Specific to game grading)
}

export interface AltAssetGame extends AltAssetBase {
  assetClass: 'video_game';
  customMetadata: GameMetadata;
}