import type { DocumentStatus } from "@/types/DocumentHistory";

export interface ArrivedShipment {
  shipmentCode: string;
  shipmentCmpSeq: number;
  companyName: string;
  items: string[];
  forwardingAgent: string | null;
  billOfLading: string | null;
  etd: string | null;
  eta: string | null;
  containerNumber: string | null;
  shippingLine: string | null;
  documentStatus: DocumentStatus;
  missingDocuments: string[];
}


