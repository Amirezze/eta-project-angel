export type DocumentStatus = "OK" | "Missing Documents";

export interface DocumentStatusCheck {
  checkedAt: Date;
  documentStatus: DocumentStatus;
  missingDocuments: string[];
}
