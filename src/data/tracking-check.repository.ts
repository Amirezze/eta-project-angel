import { appPrisma } from "@/lib/prisma-app";


export async function getTrackingChecksByShipment(shipmentCmpSeq: number, shipmentCode: string){

    try {
      const trackingChecks = await appPrisma.trackingCheck.findMany({

        where: {
        shipmentCmpSeq,
        shipmentCode,
      },

      orderBy: {
        checkedAt: "desc"
      }

    });

      return trackingChecks;
    } catch (error) {
      throw new Error(
        `Failed to fetch tracking checks for shipment ${shipmentCode} / ${shipmentCmpSeq}`,
        { cause: error }
      );
    }
    
}
