import { getShipmentTrackingHistory } from "./services/tracking-history.service";
import { getDocumentStatusesByShipment } from "./data/document-status.repository";
async function main() {
  // const shipment = await getShipment(16, "FO04/26-04");
  // const trackingChecksByShipment = await getShipmentTrackingHistory("PA03/26-01", 10)
  const DocStatus = await getDocumentStatusesByShipment("PA03/26-01", 10)

  // console.log(shipment);
  console.log(DocStatus);

}

main();

