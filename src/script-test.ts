import { getArrivedShipmentsSummary } from "@/services/arrived-shipment.service";

async function main() {
  await getArrivedShipmentsSummary();
}

main()
  .catch((error) => console.error(error))
  .finally(() => process.exit(0));
