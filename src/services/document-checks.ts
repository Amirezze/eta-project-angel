import type { ShipmentDocumentStatus } from "../../generated/app-prisma/client";
import type { DocumentStatusCheck } from "@/types/DocumentHistory";

type DocumentStatusRow = Pick<ShipmentDocumentStatus, "checkedAt" | "documentType" | "isMissing">

// Rows must be sorted newest first; the result keeps that order.
export function groupDocumentChecks(rows: DocumentStatusRow[]): DocumentStatusCheck[] {

    const checks = new Map<number, DocumentStatusCheck>();

    for (const row of rows) {
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