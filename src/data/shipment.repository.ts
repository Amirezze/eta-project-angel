import { prisma } from "../lib/prisma";

export async function getShipmentById(sh_cmp_seq: number, sh_code: string) {
  const shipment = await prisma.fm_c_shipment.findUnique({
    where: {
      sh_cmp_seq_sh_code: {
        sh_cmp_seq: sh_cmp_seq,
        sh_code: sh_code,
      },
    },
    include: {
      im_shstatus: true,
      fm_c_shipmentudf: true,
    },
  });

  return shipment;
}

export async function shipmentExists(
  shipmentCode: string,
  shipmentCmpSeq: number,
) {
  const shipment = await prisma.fm_c_shipment.findUnique({
    where: {
      sh_cmp_seq_sh_code: {
        sh_cmp_seq: shipmentCmpSeq,
        sh_code: shipmentCode,
      },
    },
    select: { sh_code: true },
  });

  return shipment !== null;
}

