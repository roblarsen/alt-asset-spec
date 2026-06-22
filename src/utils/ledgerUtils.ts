import { AltAssetBase, CurrencyAmount, ProvenanceEvent } from '../types/core.js';

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
 * Executes a type-safe database consolidation when two separate URN identities 
 * are verified to be the exact same physical asset.
 * 
 * @param canonical The surviving asset record that will remain active
 * @param duplicate The redundant asset record that is being absorbed and retired
 * @returns A brand-new AltAssetBase object featuring a unified chronological ledger
 */
export function mergeAssetIdentities<T extends AltAssetBase>(canonical: T, duplicate: T): T {
  // 1. Initialize a unified historical authentication ledger array
  const combinedHistory = [
    ...(canonical.historicalAuthentication || []),
    ...(duplicate.historicalAuthentication || []),
    // Ingest the duplicate's current authentication state as a historical state
    { ...duplicate.currentAuthentication, isActive: false }
  ];

  // Deduplicate historical snapshots based on unique certification keys
  const uniqueHistoryMap = new Map<string, any>();
  combinedHistory.forEach(auth => {
    if (auth.certNumber) {
      uniqueHistoryMap.set(`${auth.grader}:${auth.certNumber}`, auth);
    }
  });
  const historicalAuthentication = Array.from(uniqueHistoryMap.values());

  // 2. Combine and deduplicate the provenance ledger events
  const unifiedEventsMap = new Map<string, ProvenanceEvent>();
  
  [...canonical.provenanceLedger, ...duplicate.provenanceLedger].forEach(event => {
    // Deduplicate by eventId (or fallback to an composite signature if id keys overlap)
    unifiedEventsMap.set(event.eventId, event);
  });

  // 3. Inject the formal structural 'asset_merge' timeline event
  const mergeEventId = `evt_merge_${canonical.urn.split(':').pop()}_${Date.now()}`;
  const mergeMarker: ProvenanceEvent = {
    eventId: mergeEventId,
    eventType: 'asset_merge',
    date: new Date().toISOString().split('T')[0] ?? '2026-06-21',
    mergedUrn: duplicate.urn,
    notes: `Identity consolidation sweep. Absorbed asset record ${duplicate.urn} into active canonical reference.`
  };
  
  unifiedEventsMap.set(mergeEventId, mergeMarker);

  // 4. Chronologically sort the entire unified timeline layout
  const sortedLedger = Array.from(unifiedEventsMap.values()).sort((a, b) => {
    return a.date.localeCompare(b.date);
  });

  // 5. Build and return the consolidated asset state
  return {
    ...canonical,
    historicalAuthentication: historicalAuthentication.length > 0 ? historicalAuthentication : undefined,
    provenanceLedger: sortedLedger
  };
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