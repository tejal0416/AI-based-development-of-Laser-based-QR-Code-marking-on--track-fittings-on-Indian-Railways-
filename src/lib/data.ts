import type { Vendor, Part, Inspection } from "./types";
import partsData from "./data/parts.json";
import vendorsData from "./data/vendors.json";

// Mock API latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parts: Part[] = partsData as Part[];
const vendors: Vendor[] = vendorsData as Vendor[];

export const getParts = async (): Promise<Part[]> => {
  await delay(100);
  return parts;
};

export const getPartByQrId = async (
  qrId: string
): Promise<Part | undefined> => {
  await delay(50);
  return parts.find((part) => part.qrId === qrId);
};

export const getPartById = async (id: string): Promise<Part | undefined> => {
  await delay(50);
  return parts.find((part) => part.id === id);
};

export const getVendorById = async (
  id: string
): Promise<Vendor | undefined> => {
  await delay(50);
  return vendors.find((vendor) => vendor.id === id);
};
