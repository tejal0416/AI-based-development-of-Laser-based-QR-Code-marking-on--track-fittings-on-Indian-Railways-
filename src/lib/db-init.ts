// Use tsx to run this file: `npx tsx src/lib/db-init.ts`
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

// Mock data (previously in data.ts)
const vendors = [
  {
    id: "vendor-1",
    name: "RailTough Components",
    contact: "sales@railtough.com",
  },
  { id: "vendor-2", name: "SteelForgé Inc.", contact: "support@steelforge.com" },
];

const parts = [
  {
    id: "part-1",
    qrId: "RW-PART-001",
    name: "Pandrol e-Clip",
    description:
      "A resilient, threadless rail fastening system used to secure rails to railroad ties. Known for its high clamping force and fatigue resistance.",
    category: "Fasteners",
    imageUrl: "https://picsum.photos/seed/clip/600/400",
    dataAiHint: "item photo",
    vendorId: "vendor-1",
    inspections: [
      {
        id: "insp-1a",
        date: "2023-11-15T10:00:00Z",
        inspector: "John Doe",
        notes: "No visible cracks or corrosion. Clamping force within spec.",
        status: "Passed",
      },
      {
        id: "insp-1b",
        date: "2024-05-20T14:30:00Z",
        inspector: "Jane Smith",
        notes: "Minor surface rust, but structurally sound. Re-check in 6 months.",
        status: "Passed",
      },
    ],
  },
  {
    id: "part-2",
    qrId: "RW-PART-002",
    name: "Heavy-Duty Track Bolt",
    description:
      "A high-tensile bolt used for joining fishplates to rails. Features a specialized head and nut for high-torque applications.",
    category: "Bolts & Nuts",
    imageUrl: "https://picsum.photos/seed/bolt/600/400",
    dataAiHint: "item photo",
    vendorId: "vendor-2",
    inspections: [
      {
        id: "insp-2a",
        date: "2023-09-01T09:00:00Z",
        inspector: "John Doe",
        notes: "Initial installation torque verified.",
        status: "Passed",
      },
      {
        id: "insp-2b",
        date: "2024-03-01T11:00:00Z",
        inspector: "Mike Lee",
        notes: "Signs of thread stripping found on nut. Replacement required.",
        status: "Failed",
      },
      {
        id: "insp-2c",
        date: "2024-03-05T16:00:00Z",
        inspector: "Mike Lee",
        notes: "Bolt and nut replaced. Torque re-verified.",
        status: "Passed",
      },
    ],
  },
  {
    id: "part-3",
    qrId: "RW-PART-003",
    name: "Standard Fishplate",
    description:
      "A metal bar that is bolted to the ends of two rails to join them together in a track. Made from high-strength steel.",
    category: "Joint Bars",
    imageUrl: "https://picsum.photos/seed/fishplate/600/400",
    dataAiHint: "item photo",
    vendorId: "vendor-1",
    inspections: [
      {
        id: "insp-3a",
        date: "2024-01-10T08:45:00Z",
        inspector: "Jane Smith",
        notes:
          "Hairline fracture detected near the third bolt hole. Immediate attention needed.",
        status: "Requires Attention",
      },
      {
        id: "insp-3b",
        date: "2024-04-18T13:00:00Z",
        inspector: "Sam Wilson",
        notes:
          "Follow-up on fracture. No propagation observed. Continue monitoring.",
        status: "Requires Attention",
      },
    ],
  },
  {
    id: "part-4",
    qrId: "RW-PART-004",
    name: "M63 Switch Motor",
    description:
      "An electromechanical motor that controls the movement of railroad switches, enabling trains to change tracks.",
    category: "Switches",
    imageUrl: "https://picsum.photos/seed/motor/600/400",
    dataAiHint: "item photo",
    vendorId: "vendor-2",
    inspections: [
      {
        id: "insp-4a",
        date: "2024-06-01T11:20:00Z",
        inspector: "John Doe",
        notes: "Cycle time is slow. Lubrication applied. Performance improved.",
        status: "Passed",
      },
    ],
  },
];

async function setup() {
  const dbDir = path.resolve(process.cwd(), "db");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
  }
  const dbPath = path.join(dbDir, "parts.db");
  
  console.log(`Setting up database at ${dbPath}...`);

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS vendors (
      id TEXT PRIMARY KEY,
      name TEXT,
      contact TEXT
    );

    CREATE TABLE IF NOT EXISTS parts (
      id TEXT PRIMARY KEY,
      qrId TEXT,
      name TEXT,
      description TEXT,
      category TEXT,
      imageUrl TEXT,
      dataAiHint TEXT,
      vendorId TEXT,
      inspections TEXT,
      FOREIGN KEY(vendorId) REFERENCES vendors(id)
    );
  `);

  console.log("Tables created successfully.");

  // Insert vendors
  const vendorInsert = await db.prepare(
    "INSERT OR REPLACE INTO vendors (id, name, contact) VALUES (?, ?, ?)"
  );
  for (const vendor of vendors) {
    await vendorInsert.run(vendor.id, vendor.name, vendor.contact);
  }
  await vendorInsert.finalize();
  console.log("Vendors inserted.");

  // Insert parts
  const partInsert = await db.prepare(
    "INSERT OR REPLACE INTO parts (id, qrId, name, description, category, imageUrl, dataAiHint, vendorId, inspections) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  for (const part of parts) {
    await partInsert.run(
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
  await partInsert.finalize();
  console.log("Parts inserted.");

  console.log("Database setup complete.");
  await db.close();
}

setup().catch((err) => {
  console.error("Database setup failed:", err);
  process.exit(1);
});
