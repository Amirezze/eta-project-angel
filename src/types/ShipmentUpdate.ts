export type SkipReason = "Locked" | "StatusNotAvailable";

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


export interface UpdatedShipmentTrackingInformation extends UpdatedShipmentSummary {
    lastTrackedAt: Date | null;
}

export interface UpdateShipmentResult {
    shipment: UpdatedShipmentTrackingInformation;
    updatedShipments: UpdatedShipmentSummary[];
    skippedShipments: SkippedShipment[];
}