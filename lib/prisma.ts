import { PrismaClient } from "@prisma/client";

// This prevents multiple instances of Prisma Client in development
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Optional: Log queries in development to help with debugging
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;