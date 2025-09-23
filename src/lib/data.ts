import type { Vendor, Part } from "./types";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

// In a real app, you'd fetch this from a database.
// To keep this demo simple, we're using a local SQLite database.

let db: Awaited<ReturnType<typeof open>> | null = null;

async function openDb() {
  if (db) {
    return db;
  }
  try {
    const dbPath = path.join(process.cwd(), "db", "parts.db");
    const newDb = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    db = newDb;
    return db;
  } catch (err: any) {
    if (err.code === "SQLITE_CANTOPEN") {
      throw new Error(
        'Database file "db/parts.db" not found. Please run `npm run db:init` to create it.'
      );
    }
    throw err;
  }
}


function normalizePart(part: any): Part {
  let inspections = [];
  try {
    // The database stores inspections as a JSON string
    if (part.inspections && typeof part.inspections === "string") {
      inspections = JSON.parse(part.inspections);
    }
  } catch (e) {
    console.error(`Failed to parse inspections for part ${part.id}:`, e);
    // Return empty array if parsing fails
  }
  return { ...part, inspections };
}

export const getParts = async (): Promise<Part[]> => {
  const db = await openDb();
  const parts = await db.all("SELECT * FROM parts");
  return parts.map(normalizePart);
};

export const getPartById = async (id: string): Promise<Part | undefined> => {
  const db = await openDb();
  const part = await db.get("SELECT * FROM parts WHERE id = ?", id);
  return part ? normalizePart(part) : undefined;
};

export const getPartByQrId = async (
  qrId: string
): Promise<Part | undefined> => {
  const db = await openDb();
  const part = await db.get("SELECT * FROM parts WHERE qrId = ?", qrId);
  return part ? normalizePart(part) : undefined;
};

export const getVendorById = async (
  id: string
): Promise<Vendor | undefined> => {
  const db = await openDb();
  return db.get("SELECT * FROM vendors WHERE id = ?", id);
};
