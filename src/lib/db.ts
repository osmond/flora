let prisma: any;

try {
  const { PrismaClient } = await import("@prisma/client");
  const globalForPrisma = globalThis as { prisma?: any };
  prisma = globalForPrisma.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} catch {
  prisma = {} as any;
}

export default prisma;
