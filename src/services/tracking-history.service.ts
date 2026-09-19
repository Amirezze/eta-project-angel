import { getTrackingChecksByShipment } from "@/data/tracking-check.repository";
import { getShipmentById } from "../data/shipment.repository";


export async function fetchTrackingChecksByShipment(shipmentCmpSeq: number, shipmentCode: string) {

    const shipment = await getShipmentById(shipmentCmpSeq, shipmentCode)

    if(!shipment) return null;

    const shipmentTrackingChecks = await getTrackingChecksByShipment(shipmentCmpSeq, shipmentCode);

    return shipmentTrackingChecks
}