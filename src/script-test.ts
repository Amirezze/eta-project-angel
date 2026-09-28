import { getShipmentTrackingHistory } from "./services/tracking-history.service";

async function main() {
  // const shipment = await getShipment(16, "FO04/26-04");
  const trackingChecksByShipment = await getShipmentTrackingHistory("PA03/26-01", 10)

  // console.log(shipment);
  console.log(trackingChecksByShipment);

}

main();

