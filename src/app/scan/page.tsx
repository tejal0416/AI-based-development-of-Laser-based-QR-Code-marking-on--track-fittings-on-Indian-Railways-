

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { AppLayout } from "@/components/app-layout";
import { QrScanner } from "@/components/qr-scanner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import type { Part } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getParts, getPartByQrId } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


export default function ScanPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [detectedPart, setDetectedPart] = useState<Part | null>(null);
  const [recentScans, setRecentScans] = useState<Part[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Load recent scans on mount
    const loadRecentScans = async () => {
      const allParts = await getParts();
      // Get the last 3 scanned parts for demonstration
      const sortedParts = allParts.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentScans(sortedParts.slice(0, 3));
    };
    loadRecentScans();
  }, []);

  const handleScanStart = () => {
    setDetectedPart(null);
    setShowScanner(true);
  }

  const handleCancel = () => {
    setShowScanner(false);
    setDetectedPart(null);
  }
  
  const handlePartDetect = async (qrId: string) => {
    setShowScanner(false);
    const part = await getPartByQrId(qrId);
    if (part) {
        setDetectedPart(part);
        toast({
            title: "Part Detected",
            description: `Part "${part.part_name}" found.`
        });
         if (!recentScans.some(p => p.qr_id === part.qr_id)) {
            setRecentScans([part, ...recentScans].slice(0, 3));
        }
        router.push(`/parts/${part.qr_id}`);

    } else {
        toast({
            variant: "destructive",
            title: "Scan Failed",
            description: "No part found for this QR code.",
        });
    }
  }

  const getPartImage = (partType: string) => {
    switch (partType) {
        case "sleeper":
            return PlaceHolderImages.find(img => img.id === 'sleeper');
        case "rail_clip":
            return PlaceHolderImages.find(img => img.id === 'clipper');
        case "rail_pad":
             return PlaceHolderImages.find(img => img.id === 'pads');
        case "liner":
            return PlaceHolderImages.find(img => img.id === 'liners');
        default:
            return PlaceHolderImages[0];
    }
  }


  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline">
                    Scan Part
                </h2>
                <p className="text-muted-foreground mt-1">
                    Use your device camera to scan a barcode/QR or upload a photo to identify the part.
                </p>
            </div>
            <Button variant="outline" asChild>
                <Link href="/dashboard">
                    <Icons.arrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card className="flex flex-col">
                <CardContent className="p-6">
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-slate-50 flex items-center justify-center">
                        <div className={`${showScanner ? 'block' : 'hidden'} w-full h-full`}>
                            <QrScanner onPartDetect={handlePartDetect} />
                        </div>
                       {!showScanner && (
                            <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
                                <Icons.scanFrame className="w-16 h-16" />
                                <span>Align the code inside the frame</span>
                            </div>
                       )}
                    </div>
                </CardContent>
                <CardHeader className="pt-0 px-6 pb-6">
                     <div className="flex items-center gap-4">
                        <Button variant="outline" className="w-full" onClick={handleScanStart} disabled={showScanner}>
                            <Icons.scanLine className="mr-2 h-5 w-5" />
                            Start Scan
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Icons.upload className="mr-2 h-5 w-5" />
                            Upload Photo
                        </Button>
                     </div>
                     <CardDescription className="text-center mt-4">
                        Supported: QR, Code-128, DataMatrix. Good lighting improves accuracy.
                     </CardDescription>
                </CardHeader>
            </Card>

            <div className="space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-lg">
                            <Icons.info className="h-5 w-5"/>
                            Detected Metadata
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                           <Label htmlFor="part-id">Part ID:</Label>
                           <Input id="part-id" readOnly value={detectedPart?.qr_id || '—'}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category:</Label>
                                <Input id="category" readOnly value={detectedPart?.part_type || '—'} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="batch">Batch:</Label>
                                <Input id="batch" readOnly value={detectedPart?.lot_no ? detectedPart.lot_no.slice(-4) : '—'} />
                            </div>
                        </div>
                         <div className="grid gap-2">
                           <Label htmlFor="notes">Notes:</Label>
                           <Textarea id="notes" placeholder="Add any relevant notes here..." />
                        </div>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline text-lg">
                            <Icons.history className="h-5 w-5"/>
                            Recent Scans
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentScans.length > 0 ? (
                             <div className="space-y-4">
                                {recentScans.map(part => {
                                     const partImage = getPartImage(part.part_type);
                                     const latestStatus = part.inspections.length > 0 ? part.inspections.sort((a,b) => new Date(b.insp_date).getTime() - new Date(a.insp_date).getTime())[0].status : "Not Inspected";
                                     const statusVariant = latestStatus === "Passed" ? "default" : "destructive";
                                    return(
                                        <div key={part.qr_id} className="flex items-center gap-4 p-2 rounded-lg bg-slate-50">
                                            <Image 
                                                src={partImage?.imageUrl || "https://picsum.photos/seed/default/64/64"} 
                                                alt={part.part_name} 
                                                width={48} 
                                                height={48} 
                                                className="rounded-md object-cover"
                                            />
                                            <div className="flex-grow">
                                                <p className="font-semibold">{part.part_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    ID: {part.qr_id} • <span className={statusVariant === 'destructive' ? 'text-red-500' : 'text-green-600'}>{latestStatus === 'Passed' ? 'Passed' : 'Requires Attention'}</span>
                                                </p>
                                            </div>
                                             <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/parts/${part.qr_id}`}>View</Link>
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No recent scans</p>
                        )}
                    </CardContent>
                 </Card>
                 <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Icons.save className="mr-2 h-4 w-4" />
                        Save to Inventory
                    </Button>
                 </div>
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
