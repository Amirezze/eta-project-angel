import { getArrivedShipmentsSummary } from "@/services/arrived-shipment.service";

async function main() {
  const result = await getArrivedShipmentsSummary();
  console.log(JSON.stringify(result, null, 2));

}

main()
  .catch((error) => console.error(error))
  .finally(() => process.exit(0));
