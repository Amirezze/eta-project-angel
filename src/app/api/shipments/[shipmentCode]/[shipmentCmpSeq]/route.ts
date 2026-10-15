import { updateShipmentTrackingInformation } from "@/services/shipment-update.service";
import {
  ShipmentRouteParamsSchema,
  UpdateShipmentTrackingSchema,
} from "@/validation/shipment-route.schema";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      shipmentCode: string;
      shipmentCmpSeq: string;
    }>;
  },
) {
  const paramsResult = ShipmentRouteParamsSchema.safeParse(await params);

  if (!paramsResult.success) {
    return NextResponse.json(
      {
        message:
          paramsResult.error.issues[0]?.message ?? "Invalid shipment parameters",
      },
      { status: 400 },
    );
  }

  // A body that isn't valid JSON is the client's mistake: 400, not 500.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const bodyResult = UpdateShipmentTrackingSchema.safeParse(body);

  if (!bodyResult.success) {
    return NextResponse.json(
      { message: bodyResult.error.issues[0]?.message ?? "Invalid request body" },
      { status: 400 },
    );
  }

  const { shipmentCode, shipmentCmpSeq } = paramsResult.data;

  try {
    const outcome = await updateShipmentTrackingInformation(
      shipmentCode,
      shipmentCmpSeq,
      bodyResult.data,
    );

    if (outcome.kind === "not-found") {
      return NextResponse.json(
        { message: "Shipment not found" },
        { status: 404 },
      );
    }

    if (outcome.kind === "conflict") {
      return NextResponse.json(
        { message: outcome.message },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        message: "Shipment tracking information updated successfully",
        ...outcome.result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update shipment tracking information", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
