export type TriggerSource = "Scheduled" | "Manual";

export interface TrackingCheck {
  checkedAt: Date;
  returnedEta: string | null;
  returnedStatus: string | null;
  success: boolean;
  triggerSource: TriggerSource | null;
  errorType: string | null;
  errorMessage: string | null;
}
