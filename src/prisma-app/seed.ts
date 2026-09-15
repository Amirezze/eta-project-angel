import { appPrisma } from "../lib/prisma-app";

async function main() {
  const trackingCheck = await appPrisma.trackingCheck.create({
    data: {
      shipmentCode: "FO04/26-04",
      shipmentCmpSeq: 16,
      returnedEta: new Date("2026-09-20"),
      returnedStatus: "Shipped",
      success: true,
      triggerSource: "Manual",
      errorType: null,
      errorMessage: null,
    },
  });

  const documentStatus = await appPrisma.shipmentDocumentStatus.create({
    data: {
      shipmentCode: "FO04/26-04",
      shipmentCmpSeq: 16,
      documentType: "BIVAC",
      isMissing: false,
    },
  });

  console.log("Tracking check created:", trackingCheck);
  console.log("Document status created:", documentStatus);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await appPrisma.$disconnect();
  });