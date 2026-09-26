
export interface TrackingHistory {
  checkedAt: Date;
  returnedEta: Date | null;
  returnedStatus: string | null;
  success: boolean;
  triggerSource: string | null;
  errorType: string | null;
  errorMessage: string | null;
}
