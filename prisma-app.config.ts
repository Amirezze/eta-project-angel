import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma-app/schema.prisma",
  migrations: {
    path: "src/prisma-app/migrations",
  },
  datasource: {
    url: process.env["APP_DATABASE_URL"],
  },
});