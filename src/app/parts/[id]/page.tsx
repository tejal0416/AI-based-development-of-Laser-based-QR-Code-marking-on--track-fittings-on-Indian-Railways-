import { notFound } from "next/navigation";
import Image from "next/image";
import {
  AlertTriangle,
  BrainCircuit,
  Building,
  CheckCircle2,
  Package,
  Wrench,
  XCircle,
} from "lucide-react";
import { getPartById, getVendorById } from "@/lib/data";
import { generateInspectionSummary } from "@/ai/flows/generate-inspection-summary";
import type { Inspection, InspectionStatus } from "@/lib/types";

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

const statusIcons: Record<InspectionStatus, React.ReactNode> = {
  Passed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  Failed: <XCircle className="h-5 w-5 text-red-500" />,
  "Requires Attention": <AlertTriangle className="h-5 w-5 text-yellow-500" />,
};

const statusBadgeVariants: Record<InspectionStatus, "default" | "destructive" | "secondary"> = {
    Passed: "default",
    Failed: "destructive",
    "Requires Attention": "secondary",
};


async function AiSummary({ partName, inspections }: { partName: string, inspections: Inspection[]}) {
  const inspectionHistory = inspections.map(
      (insp) => `Date: ${new Date(insp.date).toLocaleDateString()}, Status: ${insp.status}, Notes: ${insp.notes}`
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
              <p>No inspection history available to analyze.</p>
            </CardContent>
        </Card>
    )
  }

  const { summary } = await generateInspectionSummary({ partName, inspectionHistory });

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

  const vendor = await getVendorById(part.vendorId);

  return (
    <AppLayout>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <AiSummary partName={part.name} inspections={part.inspections} />

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
                        <TableHead>Inspector</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-1/2">Notes</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {part.inspections.length > 0 ? (
                        part.inspections
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((inspection) => (
                            <TableRow key={inspection.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                                {new Date(inspection.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{inspection.inspector}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                {statusIcons[inspection.status]}
                                <Badge variant={statusBadgeVariants[inspection.status]}>{inspection.status}</Badge>
                                </div>
                            </TableCell>
                            <TableCell>{inspection.notes}</TableCell>
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
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md mb-4">
                        <Image
                            src={part.imageUrl}
                            alt={part.name}
                            fill
                            className="object-cover"
                            data-ai-hint={part.dataAiHint}
                        />
                    </div>
                    <CardTitle className="font-headline text-2xl">{part.name}</CardTitle>
                    <CardDescription>{part.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex items-center gap-3">
                        <Wrench className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">QR ID:</span>
                        <span className="text-muted-foreground">{part.qrId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Category:</span>
                        <span className="text-muted-foreground">{part.category}</span>
                    </div>
                    {vendor && (
                        <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Vendor:</span>
                        <span className="text-muted-foreground">{vendor.name}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
