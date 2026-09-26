import { appPrisma } from "@/lib/prisma-app";

export async function getTrackingChecksByShipment(
  shipmentCmpSeq: number,
  shipmentCode: string,
) {
  return appPrisma.trackingCheck.findMany({
    where: {
      shipmentCmpSeq,
      shipmentCode,
    },
    orderBy: {
      checkedAt: "desc",
    },
  });
}
