import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// Open DB helper
async function openDb() {
  const dbPath = path.join(process.cwd(), "db", "parts.db");
  return open({ filename: dbPath, driver: sqlite3.Database });
}

export async function GET(req: Request, { params }: { params: { qrId: string } }) {
  const db = await openDb();
  try {
    const part = await db.get("SELECT * FROM parts WHERE qrId = ?", [params.qrId]);
    if (!part) return NextResponse.json({ error: "Part not found" }, { status: 404 });
    // Only return the internal ID for security/simplicity
    return NextResponse.json({ id: part.id });
  } catch (error) {
    console.error("API Error fetching part by QR ID:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
  finally {
    await db.close();
  }
}
