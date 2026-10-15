import ExcelJS from "exceljs";
import type { ArrivedShipment } from "@/types/ArrivedShipment";
import type { DocumentStatus } from "@/types/DocumentHistory";

const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  "OK": "OK",
  "Missing Documents": "Documents manquants",
  "Not Checked": "Non vérifié",
};

export async function buildArrivalSummaryWorkbook(shipments: ArrivedShipment[]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Arrivées");

  sheet.columns = [
    { header: "Shipment#", key: "shipmentCode", width: 14 },
    { header: "Société", key: "companyName", width: 22 },
    { header: "Item", key: "items", width: 40 },
    { header: "Declarant", key: "forwardingAgent", width: 18 },
    { header: "BL", key: "billOfLading", width: 20 },
    { header: "date d'embarquement", key: "etd", width: 20 },
    { header: "date d'arrivée", key: "eta", width: 16 },
    { header: "Conteneur", key: "containerNumber", width: 16 },
    { header: "Compagnie maritime", key: "shippingLine", width: 20 },
    { header: "Statut documents", key: "documentStatus", width: 20 },
    { header: "Documents manquants", key: "missingDocuments", width: 30 },
  ];

  for (const s of shipments) {
    sheet.addRow({
      ...s,
      items: s.items.join(", "),
      documentStatus: DOCUMENT_STATUS_LABELS[s.documentStatus],
      missingDocuments: s.missingDocuments.join(", "),
    });
  }

  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  return workbook.xlsx.writeBuffer();
}


