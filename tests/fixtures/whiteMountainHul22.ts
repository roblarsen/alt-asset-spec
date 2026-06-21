import { AltAssetComic } from '../../src/types/comic.js';

export const hulk2WhiteMountainMock: AltAssetComic = {
  urn: 'urn:altasset:comic:marvel:incredible-hulk:2:white-mountain-pedigree',
  schemaVersion: '1.0.0',
  assetClass: 'comic',
  
  // Phase 3: The Current Reality (The 9.2 Collapse)
  currentAuthentication: {
    grader: 'CGC',
    certNumber: '0000165006',
    numericGrade: 9.2,
    rawGradeString: '9.2 Off-White to White',
    isActive: true,
    qualifiers: [
      'White Mountain Pedigree',
      'Front Cover Multiple Address/Date/Name Stamp',
      'Spine Stress Lines Breaks Color',
      'Large Crease Breaks Color'
    ]
  },
  
  // Phase 1 & 2: The Serialization Legacy
  historicalAuthentication: [
    {
      // Phase 2: The 9.6 Peak
      grader: 'CGC',
      certNumber: '0976058001',
      numericGrade: 9.6,
      rawGradeString: '9.6 White Pages',
      isActive: false,
      qualifiers: ['Full Bottom Front Cover Lite Wear']
    },
    {
      // Phase 1: The 9.4 Foundational Holder
      grader: 'CGC',
      certNumber: '0029109020',
      numericGrade: 9.4,
      rawGradeString: '9.4 White Pages',
      isActive: false
    }
  ],
  
  provenanceLedger: [
    /* --- PHASE 1: THE 9.4 MASTRO RUN --- */
    {
      eventId: 'evt_hulk2_wm_sale_2001',
      eventType: 'auction_sale',
      date: '2001-12',
      platform: 'Mastro Auctions',
      lotNumber: '0029109020',
      notes: 'Initial pedigree slabbing under the historic 0029109 submission batch.'
    },
    {
      eventId: 'evt_hulk2_wm_sale_2004_05',
      eventType: 'private_sale',
      date: '2004-05-30',
      financials: { amount: 18500, currency: 'USD' }
    },
    {
      eventId: 'evt_hulk2_wm_sale_2004_09',
      eventType: 'private_sale',
      date: '2004-09-30',
      financials: { amount: 18500, currency: 'USD' }
    },
    {
      eventId: 'evt_hulk2_wm_sale_2004_11',
      eventType: 'private_sale',
      date: '2004-11-01',
      financials: { amount: 18500, currency: 'USD' }
    },
    {
      eventId: 'evt_hulk2_wm_sale_2006',
      eventType: 'private_sale',
      date: '2006-03-07',
      financials: { amount: 13000, currency: 'USD' }
    },
    {
      eventId: 'evt_hulk2_wm_sale_2008',
      eventType: 'private_sale',
      date: '2008-03-11',
      financials: { amount: 23000, currency: 'USD' }
    },
    
    /* --- PHASE 2: THE 9.6 UPGRADE ARBITRAGE --- */
    {
      eventId: 'evt_hulk2_wm_regrade_2010',
      eventType: 'regrade',
      date: '2010-04-21',
      platform: 'CGC',
      previousCertNumber: '0029109020',
      newCertNumber: '0976058001',
      notes: 'Cracked out of 9.4 holder. Resubmitted to CGC. Successful upgrade to 9.6 White Pages.'
    },
    {
      eventId: 'evt_hulk2_wm_sale_2011',
      eventType: 'private_sale',
      date: '2011-12-01',
      financials: { amount: 39500, currency: 'USD' }
    },
    {
      eventId: 'evt_hulk2_wm_sale_2012',
      eventType: 'private_sale',
      date: '2012-10-09',
      financials: { amount: 43000, currency: 'USD' }
    },
    {
      eventId: 'evt_hulk2_wm_sale_2013',
      eventType: 'private_sale',
      date: '2013-10-08',
      financials: { amount: 47000, currency: 'USD' }
    },
    
    /* --- PHASE 3: THE CRACKED DESTABILIZATION & 9.2 COLLAPSE --- */
    {
      eventId: 'evt_hulk2_wm_regrade_2022',
      eventType: 'regrade',
      date: '2022-11-18',
      platform: 'CGC',
      previousCertNumber: '0976058001',
      newCertNumber: '0000165006',
      notes: 'Cracked for potential further grade upgrade or raw storage. Suffered dramatic structural spine damage and crease exposure in the interim. Downgraded severely to 9.2.'
    },
    {
      eventId: 'evt_hulk2_wm_sale_2023',
      eventType: 'auction_sale',
      date: '2023-03-17',
      platform: 'ComicConnect',
      financials: { amount: 33350, currency: 'USD' },
      notes: 'First market verification of the grade collapse.'
    }
  ],
  
  tags: ['Silver Age', 'Key', 'Marvel Universe', '100k Club', 'Pedigree', 'White Mountain', 'Grade Collapse'],
  
  customMetadata: {
    publisher: 'Marvel Comics',
    title: 'Incredible Hulk',
    issueNumber: '2',
    publicationDate: '1962-07',
    keySignificance: ['1st green Hulk', '2nd appearance of Hulk', '1st appearance of the Toad Men']
  }
};
