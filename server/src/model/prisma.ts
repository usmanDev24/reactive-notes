import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const omitConfig = {
  user: {
    password: true,
    verification_code: true,
  },
} as const;
const prisma = new PrismaClient({
  adapter,
  omit: omitConfig,
});
export { prisma };
