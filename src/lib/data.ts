import type { Vendor, Part } from "./types";
import partsData from "./data/parts.json";
import vendorsData from "./data/vendors.json";

// Simulate a database query with a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getParts = async (): Promise<Part[]> => {
  await sleep(100); 
  // The type assertion is safe because we trust the JSON file structure.
  return partsData as Part[];
};

export const getPartById = async (id: string): Promise<Part | undefined> => {
  await sleep(100);
  const parts = partsData as Part[];
  return parts.find((part) => part.qr_id === id);
};

export const getPartByQrId = getPartById;

export const getVendorById = async ( id: string ): Promise<Vendor | undefined> => {
  await sleep(100);
  const vendors = vendorsData as Vendor[];
  return vendors.find((vendor) => vendor.vendor_id === id);
};
