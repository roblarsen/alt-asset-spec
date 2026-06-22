import { AltAssetBase } from '../types/core.js';

/**
 * High-performance runtime Type Guard to validate if an object conforms to AltAssetBase.
 */
export function isAltAsset(obj: any): obj is AltAssetBase {
  if (!obj || typeof obj !== 'object') return false;
  
  // Enforce mandatory structural keys
  const hasRequiredRootKeys = 
    typeof obj.urn === 'string' &&
    typeof obj.schemaVersion === 'string' &&
    ['comic', 'trading_card', 'video_game', 'coin'].includes(obj.assetClass) &&
    typeof obj.currentAuthentication === 'object' &&
    Array.isArray(obj.provenanceLedger) &&
    typeof obj.customMetadata === 'object';

  if (!hasRequiredRootKeys) return false;

  // Enforce mandatory currentAuthentication parameters
  const auth = obj.currentAuthentication;
  if (typeof auth.grader !== 'string' || typeof auth.rawGradeString !== 'string' || typeof auth.isActive !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Structural deep-validation helper that scans a provenance ledger for compliance errors.
 */
export function validateProvenanceLedger(ledger: any[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  ledger.forEach((event: any, index) => {
    if (!event.eventId || typeof event.eventId !== 'string') {
      errors.push(`Ledger index [${index}]: Missing or invalid eventId.`);
    }
    if (!event.eventType || typeof event.eventType !== 'string') {
      errors.push(`Ledger index [${index}]: Missing or invalid eventType.`);
    }
    if (!event.date || typeof event.date !== 'string') {
      errors.push(`Ledger index [${index}]: Missing or invalid ISO date string.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}