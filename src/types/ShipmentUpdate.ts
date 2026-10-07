export type SkipReason = "Locked" | "Backwards" | "StatusNotAvailable"

export interface UpdatedShipmentSummary {
    shipmentCode: string;
    shipmentCmpSeq: number;
    eta: string | null;
    status: string | null;
}


export interface SkippedShipment {
   shipmentCode: string;
    shipmentCmpSeq: number;
    reason: SkipReason;
}


export interface UpdateShipmentTrackingInformation extends UpdatedShipmentSummary {
    lastTrackedAt: Date | null;
}

export interface UpdateShipmentResult {
    shipment: UpdateShipmentTrackingInformation;
    updatedShipment: UpdatedShipmentSummary[];
    skippedShipments: SkippedShipment[];
}