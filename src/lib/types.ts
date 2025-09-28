
export interface Vendor {
  vendor_id: string;
  vendor_name: string;
  public_key: string;
}

export type InspectionStatus = 'Passed' | 'Failed' | 'Needs Repair' | 'Not Inspected';

export interface Inspection {
  insp_id: string;
  qr_id: string;
  inspector_id: string;
  insp_date: string;
  status: InspectionStatus;
  image_path: string;
  notes?: string;
}

export interface Part {
  qr_id: string;
  part_name: string;
  part_type: string;
  vendor_id: string;
  lot_no: string;
  mfg_date: string;
  warranty_days: number;
  tms_ref: string;
  created_at: string;
  inspections: Inspection[];
}
