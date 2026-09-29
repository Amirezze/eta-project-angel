import type { DocumentStatusCheck } from "@/types/DocumentHistory";
import { shipmentExists } from "@/data/shipment.repository";
import { getDocumentStatusesByShipment } from "@/data/document-status.repository";

export async function getShipmentDocumentHistory(
  shipmentCode: string,
  shipmentCmpSeq: number,
): Promise<DocumentStatusCheck[] | null> {

  const [exists, documentStatuses] = await Promise.all([
    shipmentExists(shipmentCode, shipmentCmpSeq),
    getDocumentStatusesByShipment(shipmentCode, shipmentCmpSeq),
  ]);

  if (!exists) return null;

  const checks = new Map<number, DocumentStatusCheck>();

  for (const row of documentStatuses) {
    const key = row.checkedAt.getTime();
    let check = checks.get(key);

    if (!check) {
      check = {
        checkedAt: row.checkedAt,
        documentStatus: "OK",
        missingDocuments: [],
      };
      checks.set(key, check);
    }

    if (row.isMissing) {
      check.missingDocuments.push(row.documentType);
      check.documentStatus = "Missing Documents";
    }
  }

  return Array.from(checks.values());
}
