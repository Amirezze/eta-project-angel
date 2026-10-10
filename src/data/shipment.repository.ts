import { prisma } from "@/lib/prisma";
import type { it_trans_a, im_itema } from "../../generated/prisma/client";

type TransactionKey = Pick<it_trans_a, "tra_cmp_seq" | "tra_ref_id" | "tra_ref_type">;

export const ARRIVED_STATUS_CODE = "Arr";

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

export async function getArrivedShipments() {


  const arrivedShipments = await prisma.fm_c_shipment.findMany({
    where: {
      sh_ss_code: ARRIVED_STATUS_CODE,
    },
    select: {
      sh_code: true,
      sh_cmp_seq: true,
      sh_fwd_agent: true,
      sh_ets: true,
      sh_eta: true,
      sh_despacte: true,
      fm_c_shipmentudf: { select: { udf5: true, udf10: true } },
      sdcomp: { select: { name1: true } },
      it_trans_a: { select: { tra_cmp_seq: true, tra_ref_id: true, tra_ref_type: true } },
    }
  });

  return arrivedShipments;
}


export async function getTransactionLines(keys: TransactionKey[]) {

  if (keys.length === 0) return [];

  const transactions = await prisma.it_trans_b.findMany({
    where: {
      OR: keys.map((k) => ({
        trb_cmp_seq: k.tra_cmp_seq,
        trb_tra_ref_id: k.tra_ref_id,
        trb_tra_ref_type: k.tra_ref_type,
      })),
    },
    select: { trb_cmp_seq: true, trb_tra_ref_id: true, trb_tra_ref_type: true, trb_ia_item_id: true }
  })

  return transactions;
}


export async function getItemNames(itemIds: im_itema["ia_item_id"][]) {

  if (itemIds.length === 0) return [];

  const items = await prisma.im_itema.findMany({
    where: {
      ia_item_id: { in: itemIds }
    },
    select: { ia_item_id: true, ia_name: true }
  })

  return items;
}


export async function getShipmentForUpdate(shipmentCode: string, shipmentCmpSeq: number) {
  return prisma.fm_c_shipment.findUnique({
    where: { sh_cmp_seq_sh_code: { sh_cmp_seq: shipmentCmpSeq, sh_code: shipmentCode } },
    select: { sh_code: true, sh_cmp_seq: true, sh_despacte: true, sh_ss_code: true, sh_eta: true },
  });
}


export async function getShipmentsByBillOfLading(billOfLading: string) {
  return prisma.fm_c_shipment.findMany({
    where: { sh_despacte: billOfLading },
    select: { sh_code: true, sh_cmp_seq: true, sh_ss_code: true, sh_eta: true },
  });
}

export async function getStatusesForCompanies(cmpSeqs: number[]) {
  if (cmpSeqs.length === 0) return [];

  return prisma.im_shstatus.findMany({
    where: { ss_cmp_seq: { in: cmpSeqs } },
    select: { ss_code: true, ss_cmp_seq: true, ss_description: true },
  });
}

type ShipmentToUpdate = {
  shipmentCode: string;
  shipmentCmpSeq: number;
  currentStatusCode: string | null;
  newStatusCode?: string;
};


type TrackingChanges = {
  eta?: Date;
};

class ShipmentChangedError extends Error { }

export async function updateShipmentTracking(
  shipments: ShipmentToUpdate[],
  changes: TrackingChanges,
) {

  try {
    await prisma.$transaction(async (tx) => {
      for (const s of shipments) {
        const result = await tx.fm_c_shipment.updateMany({
          where: {
            sh_cmp_seq: s.shipmentCmpSeq,
            sh_code: s.shipmentCode,
            sh_ss_code: s.currentStatusCode,
          },
          data: {
            ...(changes.eta && { sh_eta: changes.eta }),
            ...(s.newStatusCode && { sh_ss_code: s.newStatusCode }),
          }
        });

        if(result.count !== 1) throw new ShipmentChangedError();
      }
    });

    return true;
  } catch (error){
    if(error instanceof ShipmentChangedError) return false;
    throw error;
  }

}





