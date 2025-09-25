
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getPartById } from "@/lib/data";
import type { Part } from "@/lib/types";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, Camera, CheckCircle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";

function PartDetails({ part }: { part: Part }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Part Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{part.part_name}</span>
        </div>
        <div className="font-mono text-xs text-muted-foreground">{part.qr_id}</div>
      </CardContent>
    </Card>
  );
}

function AiSummary({ part }: { part: Part }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSummary() {
      const inspectionHistory = part.inspections
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
  }, [part]);

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
    // For now, we will just simulate success.
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
        <div className="max-w-2xl mx-auto w-full space-y-4">
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
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-bold">New Inspection Report</h1>
            <p className="text-muted-foreground">Review the part details and attach a photo of the defect.</p>
        </div>

        <PartDetails part={part} />
        <AiSummary part={part} />

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
                <img src={previewUrl} alt="Part preview" className="w-full h-auto rounded-md border" />
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
