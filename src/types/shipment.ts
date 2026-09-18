export interface Shipment {
  shipmentCode: string;
  shipmentCmpSeq: number;
  status: string | null;
  eta: Date | null;
  billOfLading: string | null;
  departureDate: Date | null;
  forwardingAgent: string | null;
  transmissionDate: Date | null;
  licenceNumber: string | null;
  bivacCode: string | null;
  containerNumber: string | null;
  shippingLine: string | null;
  comments: string | null;
}
