import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as { db: PrismaClient }

export const db = globalForPrisma.db || new PrismaClient().$extends(withAccelerate())

if(process.env.NODE_ENV !== 'production') globalForPrisma.db = db