import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ENV } from "../config/env";
import * as schema from "./schema";

if(!ENV.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}

// initialize PostgreSQL connection pool
const pool = new Pool({
    connectionString: ENV.DATABASE_URL,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
});

// log when first connection is established
pool.on("connect", () => {
    console.log("Database connection established");
})

// log when an error occurs on the pool
pool.on("error", (err) => {
    console.error("Database connection error", err);
});

export const db = drizzle({client: pool, schema});