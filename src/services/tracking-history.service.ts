import { getTrackingChecksByShipment } from "@/data/tracking-check.repository";
import { getShipmentById } from "@/data/shipment.repository";
import type {
  TrackingHistory,
} from "@/types/TrackingHistory";


export async function fetchTrackingChecksByShipment(
  shipmentCmpSeq: number,
  shipmentCode: string,
): Promise<TrackingHistory[] | null> {
  const shipment = await getShipmentById(shipmentCmpSeq, shipmentCode);

  if (!shipment) return null;

  const trackingChecks = await getTrackingChecksByShipment(
    shipmentCmpSeq,
    shipmentCode,
  );

  return trackingChecks.map((check) => ({
    checkedAt: check.checkedAt,
    returnedEta: check.returnedEta,
    returnedStatus: check.returnedStatus,
    success: check.success,
    triggerSource: check.triggerSource,
    errorType: check.errorType,
    errorMessage: check.errorMessage,
  }));
}
