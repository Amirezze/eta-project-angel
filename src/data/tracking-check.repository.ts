import { appPrisma } from "@/lib/prisma-app";

export async function getTrackingChecksByShipment(
  shipmentCode: string,
  shipmentCmpSeq: number,
) {
  return appPrisma.trackingCheck.findMany({
    where: {
      shipmentCode,
      shipmentCmpSeq,
    },
    orderBy: {
      checkedAt: "desc",
    },
  });
}
