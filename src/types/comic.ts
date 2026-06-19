import { AltAssetBase } from './core.js';

export interface ComicMetadata {
  publisher: string;       
  title: string;           
  /** Managed string type to cleanly account for variant keys or annual codes (e.g., '15' or '1A') */
  issueNumber: string;     
  /** Target publishing cover date code formatted to standard YYYY-MM structure */
  publicationDate: string; 
  keySignificance?: string[]; 
}

export interface AltAssetComic extends AltAssetBase {
  assetClass: 'comic';
  customMetadata: ComicMetadata;
}