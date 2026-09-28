import { getTrackingChecksByShipment } from "@/data/tracking-check.repository";
import { shipmentExists } from "@/data/shipment.repository";
import type { TrackingCheck, TriggerSource } from "@/types/TrackingCheck";

export async function getShipmentTrackingHistory(
  shipmentCode: string,
  shipmentCmpSeq: number,
): Promise<TrackingCheck[] | null> {

  const [exists, trackingChecks] = await Promise.all([
    shipmentExists(shipmentCode, shipmentCmpSeq),
    getTrackingChecksByShipment(shipmentCode, shipmentCmpSeq),
  ]);

  if (!exists) return null;

  return trackingChecks.map((check) => ({
    checkedAt: check.checkedAt,
    returnedEta: check.returnedEta?.toISOString().slice(0, 10) ?? null,
    returnedStatus: check.returnedStatus,
    success: check.success,
    triggerSource: check.triggerSource as TriggerSource | null,
    errorType: check.errorType,
    errorMessage: check.errorMessage,
  }));
}
