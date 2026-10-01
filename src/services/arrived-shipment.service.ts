import { getArrivedShipments, getTransactionLines } from "@/data/shipment.repository"

export async function getArrivedShipmentsSummary(): Promise<ArrivedShipment[]>{

    const shipments = await getArrivedShipments();

    const keys = shipments.flatMap((s) => s.it_trans_a);


     const [items, documents] = await Promise.all([
        (async () => {
            const lines =  getTransactionLines(keys);

            
        }),
     ])





}