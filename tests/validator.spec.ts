import { describe, it, expect } from 'vitest';
import { isAltAsset, validateProvenanceLedger } from '../src/validator.js';
import { getRecordHighSale, getAllAssociatedCertifications } from '../src/utils/ledgerUtils.js';
import { actionComics1Mock, fantasticFour1RegradeMock } from './fixtures/comicFixture.js';

describe('AltAssetSpec Runtime Validation Engine', () => {
  it('should successfully pass a valid structural asset schema', () => {
    expect(isAltAsset(actionComics1Mock)).toBe(true);
    expect(isAltAsset(fantasticFour1RegradeMock)).toBe(true);
  });

  it('should fail runtime validation when mandatory parameters are missing', () => {
    const corruptedRecord = { ...actionComics1Mock, urn: undefined };
    expect(isAltAsset(corruptedRecord)).toBe(false);
  });

  it('should flag ledger errors when event criteria fields are broken', () => {
    const brokenLedger = [
      { eventId: 'evt_good', eventType: 'auction_sale', date: '2026-01-01' },
      { eventType: 'malformed_missing_id', date: '2026-02-02' } // missing eventId
    ];
    
    const status = validateProvenanceLedger(brokenLedger);
    expect(status.isValid).toBe(false);
    expect(status.errors[0]).toContain('Missing or invalid eventId');
  });
});

describe('AltAssetSpec Ledger Utility Functions', () => {
  it('should accurately isolate the highest public transaction value', () => {
    const recordHigh = getRecordHighSale(actionComics1Mock);
    expect(recordHigh).not.toBeNull();
    expect(recordHigh?.amount).toBe(6000000);
    expect(recordHigh?.currency).toBe('USD');
  });

  it('should extract every associated serial instance throughout an asset life cycle', () => {
    const certHistory = getAllAssociatedCertifications(fantasticFour1RegradeMock);
    expect(certHistory).toHaveLength(2);
    expect(certHistory).toContain('0112233445'); // Historical CGC cert
    expect(certHistory).toContain('9988776655'); // Active current CGC cert
  });
});