// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
import { env } from "node:process";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${env.DATABASE_URL}`;

// const adapter = new PrismaBetterSqlite3({ url: connectionString });
const adapter = new PrismaPg({connectionString})
const prisma = new PrismaClient({ adapter });

export default prisma;
