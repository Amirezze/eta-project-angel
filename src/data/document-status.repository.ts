import { appPrisma } from "@/lib/prisma-app";

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

