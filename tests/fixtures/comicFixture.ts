import { AltAssetComic } from '../../src/types/comic.js';

/**
 * Fixture mimicking a classic standalone six-figure record entry
 */
export const actionComics1Mock: AltAssetComic = {
  urn: 'urn:altasset:comic:dc:action-comics-1:pedigree-copy',
  schemaVersion: '1.0.0',
  assetClass: 'comic',
  currentAuthentication: {
    grader: 'CGC',
    certNumber: '4001234001',
    numericGrade: 8.5,
    rawGradeString: '8.5 Very Fine/Near Mint',
    isActive: true,
    qualifiers: ['White Pages']
  },
  provenanceLedger: [
    {
      eventId: 'evt_ac1_sale_2024',
      eventType: 'auction_sale',
      date: '2024-03-15',
      platform: 'Heritage Auctions',
      lotNumber: '81001',
      sourceLink: 'https://comics.ha.com/itm/all-star-mock-lot',
      financials: {
        amount: 6000000,
        currency: 'USD'
      },
      notes: 'Historic record-breaking public auction transaction.'
    }
  ],
  tags: ['Golden Age', 'Key', 'DC Universe', '100k Club'],
  customMetadata: {
    publisher: 'DC',
    title: 'Action Comics',
    issueNumber: '1',
    publicationDate: '1938-06',
    keySignificance: ['First appearance of Superman']
  }
};

/**
 * Fixture tracking an intra-company regrade (CGC 9.2 cracked, pressed, bumped to CGC 9.4)
 */
export const fantasticFour1RegradeMock: AltAssetComic = {
  urn: 'urn:altasset:comic:marvel:fantastic-four-1:regrade-case',
  schemaVersion: '1.0.0',
  assetClass: 'comic',
  currentAuthentication: {
    grader: 'CGC',
    certNumber: '9988776655',
    numericGrade: 9.4,
    rawGradeString: '9.4 Off-White to White',
    isActive: true
  },
  historicalAuthentication: [
    {
      grader: 'CGC',
      certNumber: '0112233445',
      numericGrade: 9.2,
      rawGradeString: '9.2 Off-White',
      isActive: false
    }
  ],
  provenanceLedger: [
    {
      eventId: 'evt_ff1_initial_sale',
      eventType: 'auction_sale',
      date: '2018-11-10',
      platform: 'ComicConnect',
      financials: {
        amount: 120000,
        currency: 'USD'
      }
    },
    {
      eventId: 'evt_ff1_press_regrade',
      eventType: 'regrade',
      date: '2022-04-18',
      platform: 'CGC',
      previousCertNumber: '0112233445',
      newCertNumber: '9988776655',
      notes: 'Cracked out of 9.2 holder, undergone non-restorative pressing, resubmitted to CGC. Grade bumped to 9.4.'
    }
  ],
  customMetadata: {
    publisher: 'Marvel',
    title: 'Fantastic Four',
    issueNumber: '1',
    publicationDate: '1961-11'
  }
};