export interface EligibleShipment {
  shipmentCode: string;
  shipmentCmpSeq: number;
  containerNumber: string;
  shippingLine: string;
  currentEta: string | null;
  currentStatus: string | null;
  lastTrackedAt: Date | null;
}


