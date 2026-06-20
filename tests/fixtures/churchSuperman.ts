import { AltAssetComic } from '../../src/types/comic.js';

export const churchSuperman1Mock: AltAssetComic = {
  urn: 'urn:altasset:comic:dc:superman:1:edgar-church-copy',
  schemaVersion: '1.0.0',
  assetClass: 'comic',
  
  // Current active configuration following the massive 2026 transaction
  currentAuthentication: {
    grader: 'CGC',
    numericGrade: 8.5,
    rawGradeString: '8.5 Very Fine',
    isActive: true,
    qualifiers: ['Off-White to White Pages', 'Edgar Church Pedigree']
  },
  
  // Comprehensive history of how this physical book was labeled over 50 years
  historicalAuthentication: [
    {
      grader: 'CGC',
      numericGrade: 8.0,
      rawGradeString: '8.0 Very Fine',
      isActive: false
    },
    {
      // Historic pre-slab raw state 
      grader: 'RAW',
      rawGradeString: 'Near Mint / Mint (Uncertified)',
      isActive: false
    }
  ],
  
  provenanceLedger: [
    {
      eventId: 'evt_sup1_church_photo_1977',
      eventType: 'pedigree_discovery',
      date: '1977-01-01', // Year fallback for historic documentation tracking
      platform: 'Mile High Collection Discovery',
      notes: 'Chuck Rozanski famously photographed holding this exact copy, permanently establishing its pedigree provenance.'
    },
    {
      eventId: 'evt_sup1_sale_1995',
      eventType: 'private_sale',
      date: '1995-07', // July 1995
      counterpartyFrom: 'Red Beard',
      counterpartyTo: 'Bechara Malouf',
      financials: {
        amount: 170000,
        currency: 'USD'
      },
      notes: 'Historical dealer transaction. Book was unslabbed (RAW) during execution.'
    },
    {
      eventId: 'evt_sup1_interim_regrade',
      eventType: 'regrade',
      date: '2023-01', // Baseline event separating the 8.0 and 8.5 states
      platform: 'CGC',
      notes: 'Book was re-evaluated by CGC. Grade shifted from its initial encapsulation baseline of 8.0 up to a definitive 8.5.'
    },
    {
      eventId: 'evt_sup1_sale_2022',
      eventType: 'private_sale',
      date: '2022-04', // April 2022
      counterpartyFrom: 'Tony Arnold / Roy Delic',
      financials: {
        amount: 5300000,
        currency: 'USD'
      },
      notes: 'Private broker transaction. Transaction executed while graded as a CGC 8.0.'
    },
    {
      eventId: 'evt_sup1_bundle_sale_2026',
      eventType: 'private_sale',
      date: '2026-02-05', // Official Heritage Press Release Date
      platform: 'Heritage Auctions',
      financials: {
        amount: 7000000,
        currency: 'USD'
      },
      notes: 'Part of a monumental $13 Million private treaty transaction brokered by Heritage Auctions and SemperFi Comics, selling alongside the highest-graded Batman #1 (CGC 9.4) for $6M.',
      sourceLink: 'https://comics.ha.com/heritage-auctions-press-releases-and-news/a-record-breaking-sale-two-10-cent-comic-books-sell-for-13-million.s?releaseId=5392'
    }
  ],
  
  tags: ['Golden Age', 'Key', 'DC Universe', '100k Club', 'Pedigree', 'Edgar Church'],
  
  customMetadata: {
    publisher: 'DC',
    title: 'Superman',
    issueNumber: '1',
    publicationDate: '1939-06',
    keySignificance: ['Origin of Superman retold', 'First character-focused title']
  }
};