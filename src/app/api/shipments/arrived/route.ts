import { getArrivedShipmentsSummary } from "@/services/arrived-shipment.service";
import { NextResponse } from "next/server";


export async function GET() {

    try {

        const shipments = await getArrivedShipmentsSummary();

        return NextResponse.json(
            {
                data: shipments,
                total: shipments.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to retrieve arrived shipments", error);
        return NextResponse.json(
            { message: "An unexpected error occurred" },
            { status: 500 },
        );
    }
}