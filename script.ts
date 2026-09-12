import { prisma } from "@/lib/prisma";

async function main(){

 const shipment = await prisma.fm_c_shipment.findUnique({
    where: {
      sh_cmp_seq_sh_code: {
        sh_cmp_seq: 16,
        sh_code: "FO04/26-04",
      },
    },
    include: {
      im_shstatus: true,
      fm_c_shipmentudf: true,
      },
  });

  const gsn = await prisma.it_trans_a.findFirst({
  where: {
    tra_shipment: "FO04/26-04",
    tra_ref_type: 22,
  },
});

  console.log("Shipment:", shipment);
  console.log("GSN:", gsn);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });