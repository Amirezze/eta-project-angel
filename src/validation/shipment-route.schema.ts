import { z } from "zod";

export const ShipmentRouteParamsSchema = z.object({
  shipmentCode: z
    .string()
    .regex(
      /^[A-Za-z]{2}(0[1-9]|1[0-2])\/\d{2}-\d{2}$/,
      "shipmentCode must match format AAMM/YY-NN",
    ),
    shipmentCmpSeq: z.coerce.number().int().positive()
});