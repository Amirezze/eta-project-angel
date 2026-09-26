import { fetchTrackingChecksByShipment } from "@/services/tracking-history.service";
import { ShipmentRouteParamsSchema } from "@/validation/shipment-route.schema";
import { NextResponse } from "next/server";


export async function GET(
    _request: Request,
    { params }: {
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
      {message: "Invalid shipment parameters"},
      {status: 400}
    );
  } 

  const data = result.data;

  try {
    const checks = await fetchTrackingChecksByShipment(
      data.shipmentCmpSeq,
      data.shipmentCode,
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
        { status: 200 }
    );
    
  } catch (error) {
    console.error("Failed to retrieve tracking history", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

