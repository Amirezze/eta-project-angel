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


export async function getLatestSuccessfulCheckDates(
  shipments: { shipmentCode: string, shipmentCmpSeq: number}[]
) {
  if(shipments.length === 0) return [];
  
  return appPrisma.trackingCheck.groupBy({
    by: ["shipmentCode", "shipmentCmpSeq"],
    where: {
      success: true,
      OR: shipments.map((s) => ({
        shipmentCode: s.shipmentCode,
        shipmentCmpSeq: s.shipmentCmpSeq,
      })),
    },
    _max: {checkedAt: true},
  });
}