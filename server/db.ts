import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Get DATABASE_URL with fallback
const databaseUrl = process.env.DATABASE_URL || process.env.REPLIT_DB_URL || 'postgresql://localhost:5432/defaultdb';

console.log('[DB] Connecting to database...');

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });