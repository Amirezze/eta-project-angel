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


export async function getLatestSuccessfulTrackingCheck(
  shipmentCode: string,
  shipmentCmpSeq: number,
) {
  return appPrisma.trackingCheck.findFirst({
    where: { shipmentCode, shipmentCmpSeq, success: true },
    orderBy: { checkedAt: "desc" },
    select: { checkedAt: true },
  });
}