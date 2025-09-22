import type { Vendor, Part } from './types';

export const vendors: Vendor[] = [
  { id: 'vendor-1', name: 'RailTough Components', contact: 'sales@railtough.com' },
  { id: 'vendor-2', name: 'SteelForgé Inc.', contact: 'support@steelforge.com' },
];

export const parts: Part[] = [
  {
    id: 'part-1',
    qrId: 'RW-PART-001',
    name: 'Pandrol e-Clip',
    description: 'A resilient, threadless rail fastening system used to secure rails to railroad ties. Known for its high clamping force and fatigue resistance.',
    category: 'Fasteners',
    imageUrl: 'https://picsum.photos/seed/rail1/600/400',
    dataAiHint: 'item photo',
    vendorId: 'vendor-1',
    inspections: [
      { id: 'insp-1a', date: '2023-11-15T10:00:00Z', inspector: 'John Doe', notes: 'No visible cracks or corrosion. Clamping force within spec.', status: 'Passed' },
      { id: 'insp-1b', date: '2024-05-20T14:30:00Z', inspector: 'Jane Smith', notes: 'Minor surface rust, but structurally sound. Re-check in 6 months.', status: 'Passed' },
    ],
  },
  {
    id: 'part-2',
    qrId: 'RW-PART-002',
    name: 'Heavy-Duty Track Bolt',
    description: 'A high-tensile bolt used for joining fishplates to rails. Features a specialized head and nut for high-torque applications.',
    category: 'Bolts & Nuts',
    imageUrl: 'https://picsum.photos/seed/rail2/600/400',
    dataAiHint: 'item photo',
    vendorId: 'vendor-2',
    inspections: [
      { id: 'insp-2a', date: '2023-09-01T09:00:00Z', inspector: 'John Doe', notes: 'Initial installation torque verified.', status: 'Passed' },
      { id: 'insp-2b', date: '2024-03-01T11:00:00Z', inspector: 'Mike Lee', notes: 'Signs of thread stripping found on nut. Replacement required.', status: 'Failed' },
      { id: 'insp-2c', date: '2024-03-05T16:00:00Z', inspector: 'Mike Lee', notes: 'Bolt and nut replaced. Torque re-verified.', status: 'Passed' },
    ],
  },
  {
    id: 'part-3',
    qrId: 'RW-PART-003',
    name: 'Standard Fishplate',
    description: 'A metal bar that is bolted to the ends of two rails to join them together in a track. Made from high-strength steel.',
    category: 'Joint Bars',
    imageUrl: 'https://picsum.photos/seed/rail3/600/400',
    dataAiHint: 'item photo',
    vendorId: 'vendor-1',
    inspections: [
      { id: 'insp-3a', date: '2024-01-10T08:45:00Z', inspector: 'Jane Smith', notes: 'Hairline fracture detected near the third bolt hole. Immediate attention needed.', status: 'Requires Attention' },
      { id: 'insp-3b', date: '2024-04-18T13:00:00Z', inspector: 'Sam Wilson', notes: 'Follow-up on fracture. No propagation observed. Continue monitoring.', status: 'Requires Attention' },
    ],
  },
  {
    id: 'part-4',
    qrId: 'RW-PART-004',
    name: 'M63 Switch Motor',
    description: 'An electromechanical motor that controls the movement of railroad switches, enabling trains to change tracks.',
    category: 'Switches',
    imageUrl: 'https://picsum.photos/seed/rail4/600/400',
    dataAiHint: 'item photo',
    vendorId: 'vendor-2',
    inspections: [
      { id: 'insp-4a', date: '2024-06-01T11:20:00Z', inspector: 'John Doe', notes: 'Cycle time is slow. Lubrication applied. Performance improved.', status: 'Passed' },
    ],
  },
];

export const getParts = async () => {
  return Promise.resolve(parts);
};

export const getPartByQrId = async (qrId: string) => {
  const part = parts.find((p) => p.qrId === qrId);
  return Promise.resolve(part);
};

export const getPartById = async (id: string) => {
  const part = parts.find((p) => p.id === id);
  return Promise.resolve(part);
};

export const getVendorById = async (id: string) => {
  const vendor = vendors.find((v) => v.id === id);
  return Promise.resolve(vendor);
};
