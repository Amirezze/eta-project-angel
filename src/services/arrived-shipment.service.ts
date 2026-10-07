import { getDocumentStatusesForShipments } from "@/data/document-status.repository";
import { getArrivedShipments, getItemNames, getTransactionLines } from "@/data/shipment.repository"
import type { ArrivedShipment } from "@/types/ArrivedShipment";
import { groupDocumentChecks } from "@/services/document-checks";
import { SHIPPING_LINE_MAP } from "@/services/shipment.service";



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

function toDateString(date: Date | null) {
    return date ? date.toISOString().slice(0, 10) : null;
}

function emptyToNull(value: string | null) {
    return value?.trim() ? value.trim() : null;
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


    const result = shipments.map((s) => {
        const itemNames = new Set<string>();
        for (const t of s.it_trans_a) {
            const ids = itemIdsByTransaction.get(
                transactionKey(t.tra_cmp_seq, t.tra_ref_id, t.tra_ref_type),
            ) ?? [];
            for (const id of ids) {
                const name = itemNameById.get(id);
                if (name) itemNames.add(name)
            }
        }


        const rows = documentRowsByShipment.get(shipmentKey(s.sh_code, s.sh_cmp_seq)) ?? [];
        const latest = groupDocumentChecks(rows)[0];


        const shippingLineCode = s.fm_c_shipmentudf?.udf10 ?? null;

        return {
            shipmentCode: s.sh_code,
            shipmentCmpSeq: s.sh_cmp_seq,
            companyName: s.sdcomp.name1,
            items: [...itemNames],
            forwardingAgent: emptyToNull(s.sh_fwd_agent),
            billOfLading: emptyToNull(s.sh_despacte),
            etd: toDateString(s.sh_ets),
            eta: toDateString(s.sh_eta),
            containerNumber: emptyToNull(s.fm_c_shipmentudf?.udf5 ?? null),
            shippingLine: shippingLineCode
                ? (SHIPPING_LINE_MAP[shippingLineCode] ?? null)
                : null,
            documentStatus: latest?.documentStatus ?? "Not Checked",
            missingDocuments: latest?.missingDocuments ?? [],
        };
    })

    return result;
}





