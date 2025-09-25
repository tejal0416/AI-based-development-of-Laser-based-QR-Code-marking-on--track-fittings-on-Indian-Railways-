
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getPartById, getVendorById } from "@/lib/data";
import type { Part, Inspection } from "@/lib/types";
import { format, formatDistanceToNow, addDays, differenceInDays } from "date-fns";
import { generateInspectionSummary } from "@/ai/flows/generate-inspection-summary";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BrainCircuit,
  Camera,
  CheckCircle,
  Package,
  Building,
  CheckCircle2,
  Wrench,
  XCircle,
  Clock,
  ShieldCheck,
  Hash,
  Tag,
  File,
  Info,
  CalendarDays,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


const statusIcons: Record<string, React.ReactNode> = {
  Passed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  Failed: <XCircle className="h-5 w-5 text-red-500" />,
  "Needs Repair": <Wrench className="h-5 w-5 text-yellow-500" />,
  "Not Inspected": <File className="h-5 w-5 text-gray-500" />,
};

const statusBadgeVariants: Record<string, "default" | "destructive" | "secondary"> = {
    Passed: "default",
    Failed: "destructive",
    "Needs Repair": "secondary",
    "Not Inspected": "secondary",
};


async function AiSummary({ part, inspections }: { part: Part, inspections: Inspection[]}) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSummary() {
      const inspectionHistory = inspections
        .map(
          (insp) =>
            `Date: ${new Date(
              insp.insp_date
            ).toLocaleDateString()}, Status: ${insp.status}, Inspector: ${
              insp.inspector_id
            }`
        )
        .join("\n");

      if (!inspectionHistory) {
        setSummary(`No inspection history available to analyze for part ${part.part_name}.`);
        setLoading(false);
        return;
      }
      
      try {
        const result = await generateInspectionSummary({
          partName: part.part_name,
          inspectionHistory,
        });
        setSummary(result.summary);
      } catch (error) {
          console.error("Error generating summary:", error);
          setSummary("Could not generate AI summary at this time.");
      } finally {
          setLoading(false);
      }
    }
    getSummary();
  }, [part, inspections]);

  return (
    <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-primary">
                <BrainCircuit />
                AI Inspection Analysis
            </CardTitle>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ) : (
                 <p className="text-base leading-relaxed">{summary}</p>
            )}
        </CardContent>
    </Card>
  );
}

function WarrantyCard({ part }: { part: Part }) {
    const mfgDate = new Date(part.mfg_date);
    const expiryDate = addDays(mfgDate, part.warranty_days);
    const daysLeft = differenceInDays(expiryDate, new Date());
    const hasExpired = daysLeft <= 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="font-headline flex items-center gap-2">
                        <ShieldCheck />
                        Warranty Status
                    </CardTitle>
                    <Badge variant="outline" className="flex items-center gap-1 border-primary/50 text-primary text-xs">
                        <BrainCircuit className="h-3 w-3" />
                        AI Generated & Refined
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <span className="font-medium">Manufactured</span>
                        <p className="text-muted-foreground">{format(mfgDate, "PP")}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <span className="font-medium">Warranty Expires</span>
                        <p className="text-muted-foreground">{format(expiryDate, "PP")}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <ShieldAlert className={cn("h-5 w-5 mt-0.5", hasExpired ? 'text-red-500' : 'text-green-500')} />
                    <div>
                        <span className="font-medium">Time Left</span>
                        <p className={cn("font-bold text-lg", hasExpired ? 'text-red-500' : 'text-green-500')}>
                            {hasExpired ? "Expired" : `${daysLeft} days`}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function PartInfoAndHistory({ part }: { part: Part }) {
  const [vendorName, setVendorName] = useState<string | null>(null);

  useEffect(() => {
    async function loadVendor() {
      const vendor = await getVendorById(part.vendor_id);
      if (vendor) {
        setVendorName(vendor.vendor_name);
      }
    }
    loadVendor();
  }, [part.vendor_id]);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-8">
        <AiSummary part={part} inspections={part.inspections} />
        <WarrantyCard part={part} />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Inspection History</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Info className="w-4 h-4"/>
              This log is retrieved from connected UDM and TMS portals.
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
            <CardTitle className="font-headline">Part Details</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Info className="w-4 h-4"/>
              Data sourced from UDM and TMS portals.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <span className="font-medium">Part Type:</span>
                <span className="text-muted-foreground ml-2">{part.part_type.replace(/_/g, ' ')}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <span className="font-medium">Lot No:</span>
                <span className="text-muted-foreground ml-2 font-mono">{part.lot_no}</span>
              </div>
            </div>
            {vendorName && (
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium">Vendor:</span>
                  <span className="text-muted-foreground ml-2">{vendorName}</span>
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
  );
}


export default function InspectionPage() {
  const params = useParams();
  const { toast } = useToast();
  const partId = params.id as string;
  
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadPart() {
      if (!partId) return;
      try {
        const fetchedPart = await getPartById(partId);
        if (fetchedPart) {
          setPart(fetchedPart);
        } else {
          notFound();
        }
      } catch (error) {
        console.error("Failed to fetch part", error);
      } finally {
        setLoading(false);
      }
    }
    loadPart();
  }, [partId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!imageFile) {
        toast({
            variant: "destructive",
            title: "No Image Selected",
            description: "Please take a picture of the part before submitting."
        });
        return;
    }
    // Here you would typically handle the form submission, e.g., upload the image and save the inspection record.
    console.log("Submitting inspection for", part?.part_name, "with image", imageFile.name);
    setSubmitted(true);
    toast({
        title: "Inspection Submitted",
        description: "Your report has been successfully recorded."
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto w-full space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!part) {
    return (
        <AppLayout>
            <div className="text-center">Part not found.</div>
        </AppLayout>
    )
  }
  
  if (submitted) {
    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto w-full text-center">
                <div className="flex justify-end mb-4">
                     <Button asChild>
                        <Link href="/dashboard">Return to Dashboard</Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <CardTitle className="mt-4">Inspection Submitted Successfully</CardTitle>
                        <CardDescription>
                            The inspection report for part <span className="font-semibold">{part.part_name}</span> has been saved.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-left space-y-2 bg-slate-50 p-4 rounded-md">
                            <h4 className="font-semibold">Review of Your Submission</h4>
                             <p className="text-sm text-muted-foreground">
                                A picture of the defect was attached. This record will now be available in the part's inspection history for future reference and audits.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div>
            <h1 className="font-headline text-3xl font-bold">New Inspection Report for {part.part_name}</h1>
            <p className="text-muted-foreground">Review the part's history and details, then attach a photo of the defect to submit your report.</p>
        </div>
        
        <PartInfoAndHistory part={part} />

        <Card>
          <CardHeader>
            <CardTitle>Attach Photo</CardTitle>
            <CardDescription>
              Take a picture of the defective part. This is the final step.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {previewUrl && (
              <div className="relative">
                <img src={previewUrl} alt="Part preview" className="w-full max-w-md mx-auto h-auto rounded-md border" />
              </div>
            )}
            <Button className="w-full" onClick={() => fileInputRef.current?.click()}>
              <Camera className="mr-2 h-4 w-4" />
              {previewUrl ? 'Retake Picture' : 'Take a Picture of the Part'}
            </Button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </CardContent>
        </Card>
        
        <Button onClick={handleSubmit} className="w-full" size="lg" disabled={!imageFile}>
            Submit Inspection
        </Button>
      </div>
    </AppLayout>
  );
}

    