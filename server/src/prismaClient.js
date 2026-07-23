import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient instance across the app (and across
// hot-reloads in dev) to avoid exhausting database connections.
const prisma = new PrismaClient();

export default prisma;
