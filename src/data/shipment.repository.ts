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

