import { appPrisma } from "@/lib/prisma-app";
import type { ShipmentDocumentStatus } from "../../generated/app-prisma/client";

type ShipmentKey = Pick<ShipmentDocumentStatus, "shipmentCode" | "shipmentCmpSeq">;

export async function getDocumentStatusesByShipment(
  shipmentCode: string,
  shipmentCmpSeq: number,
) {
  return appPrisma.shipmentDocumentStatus.findMany({
    where: {
      shipmentCode,
      shipmentCmpSeq,
    },
    orderBy: {
      checkedAt: "desc",
    },
  });
}


export async function getDocumentStatusesForShipments(shipments: ShipmentKey[]) {

  if(shipments.length === 0) return [];

  return appPrisma.shipmentDocumentStatus.findMany({
    where: {
      OR:
        shipments.map((s) => ({ shipmentCode: s.shipmentCode, shipmentCmpSeq: s.shipmentCmpSeq }))
    },
    orderBy: {
      checkedAt: "desc",
    }
  })

}
