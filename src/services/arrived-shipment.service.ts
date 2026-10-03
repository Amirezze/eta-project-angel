import { getDocumentStatusesForShipments } from "@/data/document-status.repository";
import { getArrivedShipments, getItemNames, getTransactionLines } from "@/data/shipment.repository"
import type { ArrivedShipment } from "@/types/ArrivedShipment";


async function getItemData(keys: Parameters<typeof getTransactionLines>[0]) {
    const lines = await getTransactionLines(keys);
    const ids = lines.map((line) => line.trb_ia_item_id);
    const uniqueIds = [...new Map(ids.map((id) => [id.toString(), id])).values()];
    const names = await getItemNames(uniqueIds);
    return { lines, names };
}

function shipmentKey(code: string, cmpSeq: number) {
    return `${code}-${cmpSeq}`;
}

function transactionKey(cmpSeq: number, refId: { toString(): string }, refType: number) {
    return `${cmpSeq}-${refId.toString()}-${refType}`;
}



export async function getArrivedShipmentsSummary(): Promise<ArrivedShipment[]> {

    const shipments = await getArrivedShipments();

    const keys = shipments.flatMap((s) => s.it_trans_a);
    const docsKeys = shipments.map((s) => ({
        shipmentCode: s.sh_code,
        shipmentCmpSeq: s.sh_cmp_seq,
    }));


    const [items, documents] = await Promise.all([
        getItemData(keys),
        getDocumentStatusesForShipments(docsKeys),
    ])


    const itemNameById = new Map(items.names.map((item) => [item.ia_item_id.toString(), item.ia_name]))

    const itemIdsByTransaction = new Map<string, string[]>();

    for (const line of items.lines) {
        const key = transactionKey(line.trb_cmp_seq, line.trb_tra_ref_id, line.trb_tra_ref_type);
        const ids = itemIdsByTransaction.get(key) ?? [];
        ids.push(line.trb_ia_item_id.toString());
        itemIdsByTransaction.set(key, ids);
    }

    const documentRowsByShipment = new Map<string, typeof documents>();

    for (const row of documents) {
        const key = shipmentKey(row.shipmentCode, row.shipmentCmpSeq);
        const rows = documentRowsByShipment.get(key) ?? [];
        rows.push(row);
        documentRowsByShipment.set(key, rows);
    }


     return [];
}