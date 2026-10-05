import { getArrivedShipmentsSummary } from "@/services/arrived-shipment.service";
import { buildArrivalSummaryWorkbook } from "@/services/arrival-export.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shipments = await getArrivedShipmentsSummary();
    const file = await buildArrivalSummaryWorkbook(shipments);

    return new Response(file, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="ArrivalSummary.xlsx"',
      },
    });
  } catch (error) {
    console.error("Failed to export arrival summary", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
