import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs/promises";
import partsData from "./data/parts.json";
import vendorsData from "./data/vendors.json";

async function initDb() {
  const dbPath = path.join(process.cwd(), "db");
  const dbFile = path.join(dbPath, "parts.db");

  try {
    // Ensure the db directory exists
    await fs.mkdir(dbPath, { recursive: true });
    
    // Check if the file exists and delete it to ensure a fresh start
    try {
      await fs.unlink(dbFile);
      console.log("Existing database file deleted.");
    } catch (error: any) {
      if (error.code !== 'ENOENT') { // ENOENT means file doesn't exist, which is fine
        throw error;
      }
    }

    const db = await open({
      filename: dbFile,
      driver: sqlite3.Database,
    });

    await db.exec("PRAGMA journal_mode = WAL;");
    await db.exec("BEGIN TRANSACTION;");

    console.log("Creating tables...");
    await db.exec(`
      CREATE TABLE IF NOT EXISTS vendors (
        id TEXT PRIMARY KEY,
        name TEXT,
        contact TEXT
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS parts (
        id TEXT PRIMARY KEY,
        qrId TEXT UNIQUE,
        name TEXT,
        description TEXT,
        category TEXT,
        imageUrl TEXT,
        dataAiHint TEXT,
        vendorId TEXT,
        inspections TEXT,
        FOREIGN KEY (vendorId) REFERENCES vendors (id)
      );
    `);

    console.log("Tables created. Inserting data...");

    const vendorStmt = await db.prepare(
      "INSERT INTO vendors (id, name, contact) VALUES (?, ?, ?)"
    );
    for (const vendor of vendorsData) {
      await vendorStmt.run(vendor.id, vendor.name, vendor.contact);
    }
    await vendorStmt.finalize();
    console.log(`${vendorsData.length} vendors inserted.`);

    const partStmt = await db.prepare(`
      INSERT INTO parts (id, qrId, name, description, category, imageUrl, dataAiHint, vendorId, inspections)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const part of partsData) {
      await partStmt.run(
        part.id,
        part.qrId,
        part.name,
        part.description,
        part.category,
        part.imageUrl,
        part.dataAiHint,
        part.vendorId,
        JSON.stringify(part.inspections) // Store inspections as a JSON string
      );
    }
    await partStmt.finalize();
    console.log(`${partsData.length} parts inserted.`);

    await db.exec("COMMIT;");
    console.log("Data insertion complete.");

    await db.close();
    console.log("Database initialized successfully at", dbFile);
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
}

initDb();
