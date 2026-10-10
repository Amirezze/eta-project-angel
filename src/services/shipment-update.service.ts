import {
  getShipmentForUpdate,
  getShipmentsByBillOfLading,
  getStatusesForCompanies,
  updateShipmentTracking,
} from "@/data/shipment.repository";
import { getLatestSuccessfulTrackingCheck } from "@/data/tracking-check.repository";
import type { UpdateShipmentTrackingInput } from "@/validation/shipment-route.schema";
import type {
  SkipReason,
  SkippedShipment,
  UpdatedShipmentSummary,
  UpdateShipmentResult,
} from "@/types/ShipmentUpdate";

// Request status → ERP code (lowercase; compared case-insensitively)
const TRACKING_STATUS_CODES = {
  Shipped: "shi",
  Transit: "tra",
  Arrived: "arr",
} as const;

// Statuses this endpoint may change, in any direction.
// A shipment with no status counts as Open.
const UPDATABLE_STATUSES = new Set(["ope", "grp", "shi", "tra", "arr"]);

// Set by people in the ERP; never changed by this endpoint.
const LOCKED_STATUSES = new Set(["rec", "clo", "can"]);

export type UpdateOutcome =
  | { kind: "not-found" }
  | { kind: "conflict"; message: string }
  | { kind: "updated"; result: UpdateShipmentResult };

function normalize(code: string | null) {
  return code?.trim().toLowerCase() || null;
}

function checkShipment(
  currentCode: string | null,
  newCode: string | undefined,
  companyHasNewCode: boolean,
): SkipReason | null {
  const current = normalize(currentCode);

  if (current && LOCKED_STATUSES.has(current)) return "Locked";
  if (current && !UPDATABLE_STATUSES.has(current)) return "Locked"; // unknown code: don't touch
  if (newCode && !companyHasNewCode) return "StatusNotAvailable";

  return null;
}

export async function updateShipmentTrackingInformation(
  shipmentCode: string,
  shipmentCmpSeq: number,
  input: UpdateShipmentTrackingInput,
): Promise<UpdateOutcome> {
  // 1. The URL shipment
  const target = await getShipmentForUpdate(shipmentCode, shipmentCmpSeq);
  if (!target) return { kind: "not-found" };

  const isTarget = (s: { sh_code: string; sh_cmp_seq: number }) =>
    s.sh_code === target.sh_code && s.sh_cmp_seq === target.sh_cmp_seq;

  // 2. Everything on the same BL (or just this shipment if it has no BL).
  // The URL shipment is always part of its own group, even if its BL has stray spaces.
  const bl = target.sh_despacte?.trim();
  const group = bl ? await getShipmentsByBillOfLading(bl) : [target];
  if (!group.some(isTarget)) group.push(target);

  // 3. Each company's statuses, keyed "cmp-code" in lowercase
  const statuses = await getStatusesForCompanies([...new Set(group.map((s) => s.sh_cmp_seq))]);
  const statusByKey = new Map(
    statuses.map((st) => [`${st.ss_cmp_seq}-${st.ss_code.toLowerCase()}`, st]),
  );

  // ERP code → its description for that company (e.g. "Tra" → "Transit")
  const statusDescription = (cmpSeq: number, code: string | null) =>
    code ? (statusByKey.get(`${cmpSeq}-${normalize(code)}`)?.ss_description ?? code) : null;

  const newCode = input.status ? TRACKING_STATUS_CODES[input.status] : undefined;

  // 4. Check the URL shipment first: if it can't be updated, nothing is
  const targetReason = checkShipment(
    target.sh_ss_code,
    newCode,
    !newCode || statusByKey.has(`${target.sh_cmp_seq}-${newCode}`),
  );
  if (targetReason) {
    const currentStatus = statusDescription(target.sh_cmp_seq, target.sh_ss_code);
    const messages: Record<SkipReason, string> = {
      Locked: `Shipment is ${currentStatus} and can no longer be updated`,
      StatusNotAvailable: `Status ${input.status} does not exist for this shipment's company`,
    };
    return { kind: "conflict", message: messages[targetReason] };
  }

  // 5. Split the group into "update" and "skip"
  const toUpdate: typeof group = [];
  const skippedShipments: SkippedShipment[] = [];

  for (const s of group) {
    const reason = checkShipment(
      s.sh_ss_code,
      newCode,
      !newCode || statusByKey.has(`${s.sh_cmp_seq}-${newCode}`),
    );
    if (reason) {
      skippedShipments.push({ shipmentCode: s.sh_code, shipmentCmpSeq: s.sh_cmp_seq, reason });
    } else {
      toUpdate.push(s);
    }
  }

  // 6. Write, in one transaction
  const written = await updateShipmentTracking(
    toUpdate.map((s) => ({
      shipmentCode: s.sh_code,
      shipmentCmpSeq: s.sh_cmp_seq,
      currentStatusCode: s.sh_ss_code,
      newStatusCode: newCode
        ? statusByKey.get(`${s.sh_cmp_seq}-${newCode}`)?.ss_code // this company's spelling
        : undefined,
    })),
    { eta: input.eta ? new Date(`${input.eta}T00:00:00Z`) : undefined },
  );

  if (!written) {
    return { kind: "conflict", message: "Shipment data changed during the update, please retry" };
  }

  // 7. Build the response
  const updatedShipments: UpdatedShipmentSummary[] = toUpdate.map((s) => ({
    shipmentCode: s.sh_code,
    shipmentCmpSeq: s.sh_cmp_seq,
    eta: input.eta ?? s.sh_eta?.toISOString().slice(0, 10) ?? null,
    status: statusDescription(s.sh_cmp_seq, newCode ?? s.sh_ss_code),
  }));

  const latestCheck = await getLatestSuccessfulTrackingCheck(shipmentCode, shipmentCmpSeq);
  const targetSummary = updatedShipments.find(
    (s) => s.shipmentCode === target.sh_code && s.shipmentCmpSeq === target.sh_cmp_seq,
  )!;

  return {
    kind: "updated",
    result: {
      shipment: { ...targetSummary, lastTrackedAt: latestCheck?.checkedAt ?? null },
      updatedShipments,
      skippedShipments,
    },
  };
}
