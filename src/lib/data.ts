
import type { Vendor, Part, Inspection, InspectionStatus } from "./types";
import partsData from "./data/parts.json";
import vendorsData from "./data/vendors.json";

// In a real app, this would be a database.
let parts: Part[] = partsData as Part[];
const vendors: Vendor[] = vendorsData as Vendor[];

// Simulate a database query with a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getParts = async (): Promise<Part[]> => {
  await sleep(100); 
  return parts;
};

export const getPartById = async (id: string): Promise<Part | undefined> => {
  await sleep(100);
  return parts.find((part) => part.qr_id === id);
};

export const getPartByQrId = getPartById;

export const getVendorById = async ( id: string ): Promise<Vendor | undefined> => {
  await sleep(100);
  return vendors.find((vendor) => vendor.vendor_id === id);
};

export const addInspection = async (newInspectionData: Omit<Inspection, 'insp_id' | 'status'>): Promise<Inspection> => {
    await sleep(100);
    const part = parts.find(p => p.qr_id === newInspectionData.qr_id);
    if (!part) {
        throw new Error("Part not found");
    }

    let status: InspectionStatus = 'Passed';
    if (newInspectionData.notes) {
        if (newInspectionData.notes.includes('fail') || newInspectionData.notes.includes('broken')) {
            status = 'Failed';
        } else {
            status = 'Needs Repair';
        }
    }
    
    const newInspection: Inspection = {
        ...newInspectionData,
        insp_id: `insp-${newInspectionData.qr_id}-${part.inspections.length}`,
        status: newInspectionData.image_path ? 'Failed' : status,
    };

    part.inspections.push(newInspection);
    
    // In a real app, you would save this back to the database.
    // Here we are just modifying the in-memory array.
    parts = parts.map(p => p.qr_id === part.qr_id ? part : p);

    return newInspection;
}
