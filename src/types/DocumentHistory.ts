export type DocumentStatus = "OK" | "Missing Documents" | "Not Checked";

export interface DocumentStatusCheck {
  checkedAt: Date;
  documentStatus: DocumentStatus;
  missingDocuments: string[];
}
