export interface Vendor {
  id: string;
  name: string;
  contact: string;
}

export type InspectionStatus = 'Passed' | 'Failed' | 'Requires Attention';

export interface Inspection {
  id: string;
  date: string;
  inspector: string;
  notes: string;
  status: InspectionStatus;
}

export interface Part {
  id: string;
  qrId: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  dataAiHint: string;
  vendorId: string;
  inspections: Inspection[];
}
