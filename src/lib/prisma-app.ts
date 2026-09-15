import "dotenv/config";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../../generated/app-prisma/client";

const sqlConfig = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_APP_NAME!,
  server: process.env.HOST!,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false, 
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const adapter = new PrismaMssql(sqlConfig);
const appPrisma = new PrismaClient({ adapter });

export { appPrisma };
