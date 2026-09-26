import { fetchTrackingChecksByShipment } from "./services/tracking-history.service";

async function main() {
  // const shipment = await getShipment(16, "FO04/26-04");
  const trackingChecksByShipment = await fetchTrackingChecksByShipment(10, "PA03/26-01")

  // console.log(shipment);
  console.log(trackingChecksByShipment);

}

main();

