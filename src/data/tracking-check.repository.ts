import { appPrisma } from "@/lib/prisma-app";

export async function getTrackingChecks() {

    const trackingCheck = await appPrisma.trackingCheck.findMany()
    return trackingCheck;
    
}


