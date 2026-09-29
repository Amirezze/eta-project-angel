import { getShipmentDocumentHistory } from "@/services/document-history.service";
import { NextResponse } from "next/server";
import { ShipmentRouteParamsSchema } from "@/validation/shipment-route.schema";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      shipmentCode: string;
      shipmentCmpSeq: string;
    }>;
  },
) {
  const { shipmentCode, shipmentCmpSeq } = await params;

  const result = ShipmentRouteParamsSchema.safeParse({
    shipmentCode,
    shipmentCmpSeq,
  });

  if (!result.success) {
    return NextResponse.json(
      {
        message:
          result.error.issues[0]?.message ?? "Invalid shipment parameters",
      },
      { status: 400 },
    );
  }

  const data = result.data;

  try {
    const checks = await getShipmentDocumentHistory(
      data.shipmentCode,
      data.shipmentCmpSeq,
    );

    if (checks === null) {
      return NextResponse.json(
        { message: "Shipment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: checks,
        total: checks.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to retrieve document history", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
