import type { Vendor, Part, Inspection } from "./types";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

// Helper to open DB connection
async function openDb() {
  // Check if the database file exists.
  const dbPath = path.resolve(process.cwd(), "db/parts.db");

  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    return db;
  } catch (error) {
    console.error("Failed to open database:", error);
    throw new Error(
      `Failed to open database at ${dbPath}. Did you run 'npm run db:init'?`
    );
  }
}

// Helper to normalize parts by parsing JSON fields
function normalizePart(part: any): Part {
  return {
    ...part,
    inspections: part.inspections ? JSON.parse(part.inspections) : [],
  };
}

export const getParts = async (): Promise<Part[]> => {
  const db = await openDb();
  const partsData = await db.all("SELECT * FROM parts");
  await db.close();
  return partsData.map(normalizePart);
};

export const getPartByQrId = async (
  qrId: string
): Promise<Part | undefined> => {
  const db = await openDb();
  const partData = await db.get("SELECT * FROM parts WHERE qrId = ?", qrId);
  await db.close();
  if (!partData) return undefined;
  return normalizePart(partData);
};

export const getPartById = async (id: string): Promise<Part | undefined> => {
  const db = await openDb();
  const partData = await db.get("SELECT * FROM parts WHERE id = ?", id);
  await db.close();
  if (!partData) return undefined;
  return normalizePart(partData);
};

export const getVendorById = async (
  id: string
): Promise<Vendor | undefined> => {
  const db = await openDb();
  const vendor = await db.get("SELECT * FROM vendors WHERE id = ?", id);
  await db.close();
  return vendor;
};
