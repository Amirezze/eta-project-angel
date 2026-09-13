import { getShipmentById } from "../data/shipment.repository";
import { Shipment } from "../types/shipment";

const SHIPPING_LINE_MAP: Record<string, string | null> = {
  "0": null,
  "1": "CMA",
  "2": "Maersk",
  "4": "Hapag",
  "6": "MSC",
};

export async function fetchShipment(
  sh_cmp_seq: number,
  sh_code: string,
): Promise<Shipment | null> {
  const shipment = await getShipmentById(sh_cmp_seq, sh_code);

  if (!shipment) {
    return null;
  }

  const shippingLineCode = shipment.fm_c_shipmentudf?.udf10 ?? null;

  const mappedShipment: Shipment = {
    shipmentCode: shipment.sh_code,
    shipmentCmpSeq: shipment.sh_cmp_seq,
    status: shipment.im_shstatus?.ss_description ?? null,
    eta: shipment.sh_eta ?? null,
    departureDate: shipment.sh_ets ?? null,
    forwardingAgent: shipment.sh_fwd_agent ?? null,
    transmissionDate: shipment.sh_docdate ?? null,
    licenceNumber: shipment.sh_bri ?? null,
    bivacCode: shipment.sh_pip ?? null,
    containerNumber: shipment.fm_c_shipmentudf?.udf5 ?? null,
    shippingLine: shippingLineCode
      ? (SHIPPING_LINE_MAP[shippingLineCode] ?? null)
      : null,
    comments: shipment.fm_c_shipmentudf?.udf13 ?? null,
  };

  return mappedShipment;
}
