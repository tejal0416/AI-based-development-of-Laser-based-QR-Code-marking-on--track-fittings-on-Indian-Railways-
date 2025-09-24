import { notFound } from "next/navigation";
import {
  AlertTriangle,
  BrainCircuit,
  Building,
  CheckCircle2,
  Wrench,
  XCircle,
  Clock,
  ShieldCheck,
  Hash,
  Tag,
  Package,
} from "lucide-react";
import { getPartById, getVendorById } from "@/lib/data";
import { generateInspectionSummary } from "@/ai/flows/generate-inspection-summary";
import type { Inspection, InspectionStatus, Part } from "@/lib/types";
import { format, formatDistanceToNow } from "date-fns";

import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type PartDetailPageProps = {
  params: {
    id: string;
  };
};

const statusIcons: Record<string, React.ReactNode> = {
  Passed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  Failed: <XCircle className="h-5 w-5 text-red-500" />,
  "Needs Repair": <Wrench className="h-5 w-5 text-yellow-500" />,
};

const statusBadgeVariants: Record<string, "default" | "destructive" | "secondary"> = {
    Passed: "default",
    Failed: "destructive",
    "Needs Repair": "secondary",
    "Not Inspected": "secondary",
};

async function AiSummary({ part, inspections }: { part: Part, inspections: Inspection[]}) {
  const inspectionHistory = inspections.map(
      (insp) => `Date: ${new Date(insp.insp_date).toLocaleDateString()}, Status: ${insp.status}, Inspector: ${insp.inspector_id}`
    ).join("\n");
  
  if (!inspectionHistory) {
    return (
        <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-primary">
                <BrainCircuit />
                AI Inspection Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>No inspection history available to analyze for part {part.part_name}.</p>
            </CardContent>
        </Card>
    )
  }

  const { summary } = await generateInspectionSummary({ partName: part.part_name, inspectionHistory });

  return (
    <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-primary">
                <BrainCircuit />
                AI Inspection Analysis
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-lg leading-relaxed">{summary}</p>
        </CardContent>
    </Card>
  )
}

export default async function PartDetailPage({ params }: PartDetailPageProps) {
  const part = await getPartById(params.id);
  if (!part) {
    notFound();
  }

  const vendor = await getVendorById(part.vendor_id);

  return (
    <AppLayout>
        <div className="mb-6">
            <h1 className="font-headline text-3xl font-bold">{part.part_name}</h1>
            <p className="text-muted-foreground">QR ID: {part.qr_id}</p>
        </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <AiSummary part={part} inspections={part.inspections} />

            <Card>
                <CardHeader>
                <CardTitle className="font-headline">Inspection History</CardTitle>
                <CardDescription>
                    Review the complete maintenance log for this part.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Inspector ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-1/2">Inspection ID</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {part.inspections.length > 0 ? (
                        part.inspections
                        .sort((a, b) => new Date(b.insp_date).getTime() - new Date(a.insp_date).getTime())
                        .map((inspection) => (
                            <TableRow key={inspection.insp_id}>
                            <TableCell className="font-medium whitespace-nowrap">
                                {format(new Date(inspection.insp_date), "PP")}
                            </TableCell>
                            <TableCell>{inspection.inspector_id}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                {statusIcons[inspection.status]}
                                <Badge variant={statusBadgeVariants[inspection.status]}>{inspection.status}</Badge>
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{inspection.insp_id}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            No inspection history found.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Part Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 text-sm">
                    <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium">Part Type:</span>
                          <span className="text-muted-foreground ml-2">{part.part_type}</span>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium">Lot No:</span>
                          <span className="text-muted-foreground ml-2 font-mono">{part.lot_no}</span>
                        </div>
                    </div>
                    {vendor && (
                        <div className="flex items-start gap-3">
                        <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                         <div>
                          <span className="font-medium">Vendor:</span>
                          <span className="text-muted-foreground ml-2">{vendor.vendor_name}</span>
                        </div>
                        </div>
                    )}
                     <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <span className="font-medium">Manufactured:</span>
                            <span className="text-muted-foreground ml-2">
                                {format(new Date(part.mfg_date), "PP")} ({formatDistanceToNow(new Date(part.mfg_date), { addSuffix: true })})
                            </span>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <span className="font-medium">Warranty:</span>
                            <span className="text-muted-foreground ml-2">{part.warranty_days} days</span>
                        </div>
                    </div>
                     <div className="flex items-start gap-3">
                        <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <span className="font-medium">TMS Reference:</span>
                            <span className="text-muted-foreground ml-2 font-mono">{part.tms_ref}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
