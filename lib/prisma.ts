import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type PrismaGlobal = typeof globalThis & { prisma?: PrismaClient };

const g = globalThis as PrismaGlobal;
const rawUrl = process.env.DATABASE_URL;

if (!rawUrl) {
  throw new Error(
    "DATABASE_URL environment variable is required but not set"
  );
}

const url: string = rawUrl;

function createClient(): PrismaClient {
  if (url.startsWith("prisma+postgres://")) {
    // Accelerate path: install @prisma/extension-accelerate and update this branch
    throw new Error(
      "Accelerate connections require @prisma/extension-accelerate — install it and update lib/prisma.ts"
    );
  }
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });
}

export const prisma: PrismaClient = g.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  g.prisma = prisma;
}
