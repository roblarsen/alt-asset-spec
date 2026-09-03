import type { AltAssetBase } from './core.js';

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
  | 'twice_up'        // Pre-1967 Silver/Golden Age standard production sizing (~12x18+)
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
  /** Issue number in which this artwork was published (or intended to be published) */
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
 * Extends AltAssetBase, anchoring 1-of-1 physical boards to published comic book issues.
 */
export interface OriginalComicArtAsset extends AltAssetBase {
  /** Asset class discriminator fixed strictly to original art */
  assetClass: 'original_art';

  /** Detailed publication context anchoring this piece to printed comic history */
  publicationTarget: PublicationTarget;

  /** Physical and artistic attributes of the piece */
  artDetails: {
    /** Type of board/composition */
    workType: ArtWorkType;
    /** Physical sizing scale */
    physicalFormat?: PhysicalFormat;
    /** Creators credited for physical work on this board */
    creators: CreatorCredit[];
    /** Media used on the board (e.g., ['ink', 'graphite', 'wash', 'blue-pencil']) */
    medium?: string[];
    /** Indicates Stan Lee margin notes, editorial stamps, or paste-up correction photostats */
    hasProductionNotes?: boolean;
  };

  /**
   * High-level survival status for the artwork:
   * - `'verified'`: Board exists, authenticated, and has documented chain of custody.
   * - `'complete_intact'`: Represents a multi-page story or complete book that remains bound/together.
   * - `'dispersed'`: Formerly intact complete run that has broken into separate individual lots.
   * - `'unconfirmed'`: Rumored or uncorroborated physical survival.
   */
  survivalStatus: 'verified' | 'complete_intact' | 'dispersed' | 'unconfirmed';
}
