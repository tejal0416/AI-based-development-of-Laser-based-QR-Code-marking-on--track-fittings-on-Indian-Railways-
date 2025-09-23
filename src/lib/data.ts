import type { Vendor, Part, Inspection } from "./types";
import partsData from "./data/parts.json";
import vendorsData from "./data/vendors.json";

// In a real app, you'd fetch this from a database.
// To keep this demo simple, we're using static JSON files.

const parts: Part[] = partsData as Part[];
const vendors: Vendor[] = vendorsData as Vendor[];

export const getParts = async (): Promise<Part[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return parts;
};

export const getPartById = async (id: string): Promise<Part | undefined> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return parts.find((part) => part.id === id);
};

export const getPartByQrId = async (qrId: string): Promise<Part | undefined> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return parts.find((part) => part.qrId === qrId);
}

export const getVendorById = async (id: string): Promise<Vendor | undefined> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return vendors.find((vendor) => vendor.id === id);
};
