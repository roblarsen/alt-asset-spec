import { describe, it, expect } from 'vitest';
import type { OriginalComicArtAsset, ProvenanceEvent } from '../src/index.js';
import { isAltAsset, validateProvenanceLedger } from '../src/index.js';

const daredevilOriginalArtFixture: OriginalComicArtAsset = {
  urn: 'urn:altasset:original_art:marvel:daredevil:1:pages-8-9:inst-01',
  schemaVersion: '1.1.0',
  assetClass: 'original_art',
  publicationTarget: {
    publisher: 'Marvel Comics',
    seriesTitle: 'Daredevil',
    issueNumber: 1,
    publicationDate: '1964-04',
    storyPageNumbers: [8, 9]
  },
  artDetails: {
    workType: 'spread',
    physicalFormat: 'twice_up',
    creators: [
      { name: 'Bill Everett', role: 'pencils_and_inks' },
      { name: 'Jack Kirby', role: 'pencils' },
      { name: 'Steve Ditko', role: 'pencils' }
    ],
    medium: ['ink', 'graphite']
  },
  survivalStatus: 'verified',
  provenanceLedger: [
    {
      eventId: 'evt_ha_807_9311',
      eventType: 'auction_sale',
      date: '2022-01',
      platform: 'Heritage Auctions',
      lotNumber: '9311',
      sourceLink:
        'https://comics.ha.com/itm/original-comic-art/panel-pages/bill-everett-original-art-for-daredevil-1-pages-8-and-9-marvel-1964-though-best-known-for-his-work-on-sub-mariner-b/a/807-9311.s'
    }
  ],
  customMetadata: {}
};

describe('Original comic art schema support', () => {
  it('preserves canonical Daredevil #1 pages 8-9 fixture shape without current authentication', () => {
    expect(daredevilOriginalArtFixture.assetClass).toBe('original_art');
    expect(daredevilOriginalArtFixture.publicationTarget.storyPageNumbers).toEqual([8, 9]);
    expect(daredevilOriginalArtFixture.artDetails.creators).toHaveLength(3);
    expect(daredevilOriginalArtFixture.provenanceLedger[0]?.lotNumber).toBe('9311');
    expect(daredevilOriginalArtFixture.currentAuthentication).toBeUndefined();
    expect(isAltAsset(daredevilOriginalArtFixture)).toBe(true);
  });

  it('accepts exhibition and asset_split provenance events', () => {
    const events: ProvenanceEvent[] = [
      {
        eventId: 'evt_exhibit_001',
        eventType: 'exhibition',
        date: '2024-03',
        platform: 'Museum of Comic and Cartoon Art',
        notes: 'Loaned for Silver Age showcase'
      },
      {
        eventId: 'evt_split_001',
        eventType: 'asset_split',
        date: '2025-08',
        notes: 'Story was split into individual page-level tracked assets.'
      }
    ];

    const status = validateProvenanceLedger(events);
    expect(status.isValid).toBe(true);
  });
});

// @ts-expect-error invalid comic art work type
const invalidWorkType: OriginalComicArtAsset['artDetails']['workType'] = 'poster';
void invalidWorkType;

// @ts-expect-error invalid comic art physical format
const invalidPhysicalFormat: NonNullable<OriginalComicArtAsset['artDetails']['physicalFormat']> = 'oversized_canvas';
void invalidPhysicalFormat;
