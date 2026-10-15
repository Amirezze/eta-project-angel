// ERP shipment status codes, in lowercase.
// Codes are compared case-insensitively: the ERP stores "Tra" or "tra"
// depending on the company, and SQL Server ignores the difference.

// Set by people in the ERP; never changed or tracked by this app.
export const LOCKED_STATUSES = new Set(["rec", "clo", "can"]);

// Not shipped yet. A shipment with no status counts as Open.
export const PRE_SHIPMENT_STATUSES = new Set(["ope", "grp"]);

// At sea.
export const IN_TRANSIT_STATUSES = new Set(["shi", "tra"]);

// Trims and lowercases an ERP status code; blank becomes null.
export function normalize(code: string | null) {
  return code?.trim().toLowerCase() || null;
}
