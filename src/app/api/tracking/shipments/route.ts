import { getEligibleShipments } from "@/services/tracking-eligibility.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shipments = await getEligibleShipments();

    return NextResponse.json(
      { data: shipments, total: shipments.length },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to retrieve eligible shipments", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
