import { AltAssetBase } from './core.js';

export type ArtWorkType = 
  | 'interior_page'
  | 'splash'
  | 'spread'
  | 'cover'
  | 'pinup'
  | 'thumbnail'
  | 'complete_story'
  | 'complete_book';

export type PhysicalFormat = 
  | 'twice_up'        // Standard Golden/Silver Age pre-1967
  | 'standard_modern' // 11x17
  | 'sketch'
  | 'layout';

export interface CreatorCredit {
  name: string;
  role: 'pencils' | 'inks' | 'pencils_and_inks' | 'script' | 'colors' | 'letters';
}

export interface PublicationTarget {
  publisher: string;
  seriesTitle: string;
  issueNumber: number;
  publicationDate?: string;
  storyTitle?: string;
  pageNumbers: number[]; // [8, 9] for spreads, [1] for splash
  isBackupStory?: boolean;
}

export interface OriginalComicArtAsset extends AltAssetBase {
  assetClass: 'comic-art';
  
  // Publication relationship link
  publicationTarget: PublicationTarget;

  // Domain specifics
  artDetails: {
    workType: ArtWorkType;
    physicalFormat?: PhysicalFormat;
    creators: CreatorCredit[];
    medium?: string[]; // e.g., ['ink', 'graphite']
    hasProductionNotes?: boolean; // e.g., Stan Lee margin notes
  };

  // Status flags
  survivalStatus: 'verified' | 'complete_intact' | 'dispersed' | 'unconfirmed';
}
