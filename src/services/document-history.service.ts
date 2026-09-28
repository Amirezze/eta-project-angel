import { DocumentStatusCheck } from "@/types/DocumentHistory";
import { shipmentExists } from "@/data/shipment.repository";
import { getDocumentStatusesByShipment } from "@/data/document-status.repository";

export async function getShipmentDocumentHistory(shipmentCode: string, shipmentCmpSeq: number) : Promise<DocumentStatusCheck[] | null> {

    const [exists, trackingChecks] = await Promise.all([
        shipmentExists(shipmentCode, shipmentCmpSeq),
        getDocumentStatusesByShipment(shipmentCode, shipmentCmpSeq),
      ]);

    if(!exists) return null;

    

}