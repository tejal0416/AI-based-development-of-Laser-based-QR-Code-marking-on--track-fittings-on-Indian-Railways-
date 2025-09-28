
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import type { Part } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { getParts, getPartByQrId } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { Loader2 } from "lucide-react";

const qrcodeRegionId = "html5qr-code-full-region";

export default function ScanPage() {
  const [recentScans, setRecentScans] = useState<Part[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isScanning, setIsScanning] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadRecentScans = async () => {
      const allParts = await getParts();
      const sortedParts = allParts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentScans(sortedParts.slice(0, 3));
    };
    loadRecentScans();
  }, []);

  const handlePartDetect = async (qrId: string) => {
      if (!isScanning || !qrId) return;
      setIsScanning(false);

      toast({
          title: "Scanning...",
          description: `QR Code Detected: ${qrId}`,
      });

      const part = await getPartByQrId(qrId);
      if (part) {
          toast({
              title: "Part Found!",
              description: "Redirecting to part details...",
          });
          router.push(`/parts/${part.qr_id}`);
      } else {
          toast({
              variant: "destructive",
              title: "Scan Failed",
              description: "No part found for this QR code.",
          });
          setTimeout(() => setIsScanning(true), 2000);
      }
  };

  useEffect(() => {
    if (!isScanning || !videoRef.current || hasCameraPermission !== true) {
      return;
    }
  
    if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrcodeRegionId, { verbose: false });
    }
    const html5QrCode = html5QrCodeRef.current;
  
    const onScanSuccess = (decodedText: string) => {
        if (html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
            handlePartDetect(decodedText);
        }
    };
  
    const onScanFailure = (error: any) => { /* ignore */ };
  
    const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.max(250, Math.floor(minEdge * 0.8));
        return { width: qrboxSize, height: qrboxSize };
    };

    if (html5QrCode.getState() !== Html5QrcodeScannerState.SCANNING) {
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: qrboxFunction, useBarCodeDetectorIfSupported: true },
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            console.error("Error starting scanner", err);
        });
    }
  
    return () => {
        if (html5QrCode && html5QrCode.getState() === Html5QrcodeScannerState.SCANNING) {
            html5QrCode.stop().catch((err) => {
                console.error("Failed to stop QR scanner:", err);
            });
        }
    };
  }, [isScanning, hasCameraPermission]);
  
  
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
  }, []);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setIsScanning(false); 
      const html5QrCode = new Html5Qrcode( "qr-reader-container-hidden", { verbose: false });
      try {
        const decodedText = await html5QrCode.scanFile(file, false);
        handlePartDetect(decodedText);
      } catch (err) {
        console.error("Error scanning file.", err);
        toast({
            variant: "destructive",
            title: "Scan Failed",
            description: "Could not decode QR code from the uploaded image.",
        });
        setTimeout(() => setIsScanning(true), 2000);
      } finally {
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    }
  };

  const getPartImage = (partType: string) => {
    return PlaceHolderImages.find(img => img.id === partType) || PlaceHolderImages.find(img => img.id === 'default');
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
                    Scan a QR code with your camera or upload a photo to identify a part.
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
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                        {hasCameraPermission === null && (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span>Requesting camera access...</span>
                          </div>
                        )}
                        
                        {hasCameraPermission === false && (
                            <Alert variant="destructive" className="w-auto">
                                <AlertTitle>Camera Access Denied</AlertTitle>
                                <AlertDescription>
                                    Please enable camera permissions in your browser settings to use the scanner.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {hasCameraPermission === true && (
                          <>
                            <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                            <div id={qrcodeRegionId} className="absolute inset-0" />
                            {!isScanning && (
                                <div className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center gap-4 p-4">
                                    <Icons.scanFrame className="w-16 h-16" />
                                    <span>Processing...</span>
                                </div>
                            )}
                          </>
                        )}
                    </div>
                </CardContent>
                <CardHeader className="pt-0 px-6 pb-6">
                     <div className="flex flex-col items-center gap-4">
                        <Button variant="outline" className="w-full" onClick={handleFileUploadClick} disabled={!isScanning}>
                            <Icons.upload className="mr-2 h-5 w-5" />
                            Upload a QR Code Image
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <div id="qr-reader-container-hidden" className="hidden"></div>
                     </div>
                     <CardDescription className="text-center mt-4">
                        Place the QR code inside the frame. Good lighting improves accuracy.
                     </CardDescription>
                </CardHeader>
            </Card>

            <div className="space-y-8">
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
                                     const latestInspection = part.inspections.length > 0 ? [...part.inspections].sort((a,b) => new Date(b.insp_date).getTime() - new Date(a.insp_date).getTime())[0] : null;
                                     const latestStatus = latestInspection ? latestInspection.status : "Not Inspected";
                                     const statusVariant = latestStatus === "Passed" ? "default" : "destructive";
                                    return(
                                        <div key={part.qr_id} className="flex items-center gap-4 p-2 rounded-lg bg-slate-50">
                                            {partImage && <Image 
                                                src={partImage.imageUrl} 
                                                alt={part.part_name} 
                                                width={48} 
                                                height={48} 
                                                className="rounded-md object-cover"
                                            />}
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
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
