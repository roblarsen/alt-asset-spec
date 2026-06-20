import { AltAssetBase, CurrencyAmount } from '../types/core.js';

/**
 * Scans the ledger and returns the single highest recorded public auction or private sale price.
 */
export function getRecordHighSale(asset: AltAssetBase, targetCurrency = 'USD'): CurrencyAmount | null {
  let highestAmount = 0;

  for (const event of asset.provenanceLedger) {
    if ((event.eventType === 'auction_sale' || event.eventType === 'private_sale') && event.financials) {
      if (event.financials.currency === targetCurrency && event.financials.amount > highestAmount) {
        highestAmount = event.financials.amount;
      }
    }
  }

  return highestAmount > 0 ? { amount: highestAmount, currency: targetCurrency } : null;
}

/**
 * Returns an array of all unique certification serial numbers this physical asset has inhabited.
 */
export function getAllAssociatedCertifications(asset: AltAssetBase): string[] {
  const certs = new Set<string>();
  
  if (asset.currentAuthentication.certNumber) {
    certs.add(asset.currentAuthentication.certNumber);
  }
  
  if (asset.historicalAuthentication) {
    for (const hist of asset.historicalAuthentication) {
      if (hist.certNumber) certs.add(hist.certNumber);
    }
  }

  return Array.from(certs);
}