import type { Vendor, Part, Inspection } from "./types";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

async function openDb() {
  try {
    const dbPath = path.join(process.cwd(), "db", "parts.db");
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    await db.run("PRAGMA foreign_keys = ON;");
    return db;
  } catch (error: any) {
    console.error("Failed to open database:", error.message);
    if (error.code === "SQLITE_CANTOPEN") {
      throw new Error(
        'Database file not found at "db/parts.db". Please run the python script you have to generate the database and QR codes and place the "parts.db" file in a "db" folder at the root of the project.'
      );
    }
    throw new Error(`Database error: ${error.message}`);
  }
}

function normalizePart(part: any, inspections: any[]): Part {
    return {
        ...part,
        inspections: inspections || [],
    };
}


export const getParts = async (): Promise<Part[]> => {
    const db = await openDb();
    try {
        const partsData = await db.all("SELECT * FROM parts ORDER BY created_at DESC");
        const parts: Part[] = [];
        for (const part of partsData) {
            const inspections = await db.all("SELECT * FROM inspections WHERE qr_id = ? ORDER BY insp_date DESC", [part.qr_id]);
            parts.push(normalizePart(part, inspections));
        }
        return parts;
    } finally {
        await db.close();
    }
};

export const getPartById = async (id: string): Promise<Part | undefined> => {
    const db = await openDb();
    try {
        const partData = await db.get("SELECT * FROM parts WHERE qr_id = ?", [id]);
        if (!partData) return undefined;
        const inspections = await db.all("SELECT * FROM inspections WHERE qr_id = ? ORDER BY insp_date DESC", [id]);
        return normalizePart(partData, inspections);
    } finally {
        await db.close();
    }
};

export const getPartByQrId = getPartById;

export const getVendorById = async ( id: string ): Promise<Vendor | undefined> => {
    const db = await openDb();
    try {
        return db.get("SELECT * FROM vendors WHERE vendor_id = ?", [id]);
    } finally {
        await db.close();
    }
};
