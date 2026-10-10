import { z } from "zod";

export const ShipmentRouteParamsSchema = z.object({
  shipmentCode: z
    .string()
    .regex(
      /^[A-Za-z]{2}(0[1-9]|1[0-2])\/\d{2}-\d{2}$/,
      "shipmentCode must match format AAMM/YY-NN",
    ),
  shipmentCmpSeq: z.coerce
    .number({ error: "shipmentCmpSeq must be an integer" })
    .int({ error: "shipmentCmpSeq must be an integer" })
    .positive({ error: "shipmentCmpSeq must be a positive integer" }),
});

export const UpdateShipmentTrackingSchema = z
  .object({
    eta: z.iso.date({ error: "eta must be a valid date (YYYY-MM-DD)" }).optional(),
    status: z
      .enum(["Shipped", "Transit", "Arrived"], {
        error: "status must be Shipped, Transit or Arrived",
      })
      .optional(),
  })
  .strict()
  .refine((body) => body.eta !== undefined || body.status !== undefined, {
    error: "At least one of eta or status must be provided",
  });

export type UpdateShipmentTrackingInput = z.infer<typeof UpdateShipmentTrackingSchema>;
