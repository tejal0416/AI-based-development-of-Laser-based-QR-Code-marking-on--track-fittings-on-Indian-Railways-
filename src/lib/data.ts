import type { Vendor, Part } from "./types";
import partsData from "./data/parts.json";
import vendorsData from "./data/vendors.json";

// In a real app, you'd fetch this from a database.
// To keep this demo simple, we're just using a JSON file.

export const getParts = async (): Promise<Part[]> => {
  // Simulate async operation
  return Promise.resolve(partsData as Part[]);
};

export const getPartById = async (id: string): Promise<Part | undefined> => {
  const parts = await getParts();
  return Promise.resolve(parts.find((part) => part.id === id));
};

export const getPartByQrId = async (
  qrId: string
): Promise<Part | undefined> => {
  const parts = await getParts();
  return Promise.resolve(parts.find((part) => part.qrId === qrId));
};

export const getVendorById = async (
  id: string
): Promise<Vendor | undefined> => {
  // Simulate async operation
  const vendors = vendorsData as Vendor[];
  return Promise.resolve(vendors.find((vendor) => vendor.id === id));
};
