import "dotenv/config";
import { env } from "node:process";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;
