import { getTrackableShipments } from "@/data/shipment.repository";
import { getLatestSuccessfulCheckDates } from "@/data/tracking-check.repository";
import { SHIPPING_LINE_MAP } from "@/services/shipment.service";
import {
  IN_TRANSIT_STATUSES,
  PRE_SHIPMENT_STATUSES,
  normalize,
} from "@/services/shipment-status";
import type { EligibleShipment } from "@/types/EligibleShipment";

// Standard container number: 4 letters + 7 digits (e.g. MSMU6326372)
const CONTAINER_FORMAT = /^[A-Z]{4}\d{7}$/;

// Tracked lines = every SHIPPING_LINE_MAP code that has a name ("0" → null is not tracked)
const TRACKED_LINE_CODES = Object.keys(SHIPPING_LINE_MAP).filter(
  (code) => SHIPPING_LINE_MAP[code],
);

function shipmentKey(code: string, cmpSeq: number) {
  return `${code}-${cmpSeq}`;
}

function toDateString(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : null;
}

// Trimmed, capitals, and only if it's a real container number
function cleanContainer(value: string | null | undefined) {
  const container = value?.trim().toUpperCase() ?? "";
  return CONTAINER_FORMAT.test(container) ? container : null;
}

export async function getEligibleShipments(): Promise<EligibleShipment[]> {
  // 1. The ERP query: status + tracked line + a container
  const rows = await getTrackableShipments({
    inTransitStatuses: [...IN_TRANSIT_STATUSES],
    preShipmentStatuses: [...PRE_SHIPMENT_STATUSES],
    shippingLineCodes: TRACKED_LINE_CODES,
  });

  // 2. The checks the database can't do: container format and blank BL
  const candidates = [];

  for (const row of rows) {
    const containerNumber = cleanContainer(row.fm_c_shipmentudf?.udf5);
    if (!containerNumber) continue; // malformed or empty container

    const shippingLine = SHIPPING_LINE_MAP[row.fm_c_shipmentudf?.udf10 ?? ""];
    if (!shippingLine) continue; // safety: not a tracked line

    const status = normalize(row.sh_ss_code);
    const isPreShipment = status === null || PRE_SHIPMENT_STATUSES.has(status);
    if (isPreShipment && !row.sh_despacte?.trim()) continue; // pre-shipment needs a real BL

    candidates.push({ row, containerNumber, shippingLine });
  }

  // 3. lastTrackedAt for all of them, in one query
  const checks = await getLatestSuccessfulCheckDates(
    candidates.map(({ row }) => ({ shipmentCode: row.sh_code, shipmentCmpSeq: row.sh_cmp_seq })),
  );
  const lastTrackedByShipment = new Map(
    checks.map((c) => [shipmentKey(c.shipmentCode, c.shipmentCmpSeq), c._max.checkedAt]),
  );

  // 4. Shape each one as EligibleShipment
  return candidates.map(({ row, containerNumber, shippingLine }) => ({
    shipmentCode: row.sh_code,
    shipmentCmpSeq: row.sh_cmp_seq,
    containerNumber,
    shippingLine,
    currentEta: toDateString(row.sh_eta),
    currentStatus: row.im_shstatus?.ss_description ?? null,
    lastTrackedAt: lastTrackedByShipment.get(shipmentKey(row.sh_code, row.sh_cmp_seq)) ?? null,
  }));
}
