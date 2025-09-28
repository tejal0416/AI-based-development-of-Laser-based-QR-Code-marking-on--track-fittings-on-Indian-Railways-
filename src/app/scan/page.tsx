
"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { AlertTriangle, Loader2 } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Icons } from "@/components/icons";
import { getPartByQrId } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const qrcodeRegionId = "html5qr-code-full-region";

type ScanStep = "pre-scan" | "scanning" | "scanned";

export default function ScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const [step, setStep] = useState<ScanStep>("pre-scan");
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [defectType, setDefectType] = useState<string>("");
  const [notes, setNotes] = useState("");

  const handlePartDetect = async (qrId: string) => {
    if (isProcessing || !qrId) return;
    setIsProcessing(true);

    if (html5QrCodeRef.current?.isScanning) {
      await html5QrCodeRef.current.stop();
    }

    toast({
      title: "QR Code Detected",
      description: `Processing ID: ${qrId}`,
    });

    const part = await getPartByQrId(qrId);
    if (part) {
      toast({
        title: "Part Found!",
        description: "Redirecting to inspection form...",
      });
      // Redirect to the new inspection form page
      router.push(`/parts/${part.qr_id}/inspect`);
    } else {
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "No part found for this QR code.",
      });
      setIsProcessing(false);
      // Optionally allow re-scanning
      setStep("scanning");
    }
  };

  useEffect(() => {
    if (step !== "scanning" || hasCameraPermission !== true) {
      return;
    }

    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode(qrcodeRegionId, { verbose: false });
    }
    const qrScanner = html5QrCodeRef.current;

    if (!qrScanner.isScanning) {
      const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const qrboxSize = Math.max(250, Math.floor(minEdge * 0.8));
          return { width: qrboxSize, height: qrboxSize };
      };

      qrScanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: qrboxFunction, useBarCodeDetectorIfSupported: true },
          handlePartDetect,
          () => {} // onScanFailure
      ).catch(err => {
          console.error("Error starting scanner", err);
          setHasCameraPermission(false);
          setStep("pre-scan");
      });
    }

    return () => {
      if (qrScanner && qrScanner.isScanning) {
        qrScanner.stop().catch(err => console.error("Failed to stop QR scanner:", err));
      }
    };
  }, [step, hasCameraPermission]);

  const startScanning = async () => {
    setStep("scanning");
    // Only request permission when the user decides to scan
    if (hasCameraPermission === null) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // We don't need to do anything with the stream directly, just requesting it is enough.
        // Once permission is granted, the useEffect will handle starting the scanner.
        setHasCameraPermission(true);
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    }
  };
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        try {
            const fileScanner = new Html5Qrcode("qr-reader-container-hidden", { verbose: false });
            const decodedText = await fileScanner.scanFile(file, false);
            handlePartDetect(decodedText);
        } catch (err) {
            console.error("Error scanning file.", err);
            toast({
                variant: "destructive",
                title: "Scan Failed",
                description: "Could not decode QR code from the uploaded image.",
            });
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight font-headline">
                    Inspect a Part
                </h2>
                <p className="text-muted-foreground mt-1">
                    Report a defect or scan a part to view its details.
                </p>
            </div>
            <Button variant="outline" asChild>
                <Link href="/dashboard">
                    <Icons.arrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>

        <div className="max-w-2xl mx-auto w-full">
        {step === "pre-scan" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-destructive" />
                Report a Defect
              </CardTitle>
              <CardDescription>
                Select the type of issue found with this part. This helps in accurate reporting and maintenance planning.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>What is the issue?</Label>
                 <RadioGroup value={defectType} onValueChange={setDefectType}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cracked" id="cracked" />
                      <Label htmlFor="cracked">Cracked or Broken</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="corrosion" id="corrosion" />
                      <Label htmlFor="corrosion">Severe Corrosion</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wear" id="wear" />
                      <Label htmlFor="wear">Excessive Wear</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="misaligned" id="misaligned" />
                      <Label htmlFor="misaligned">Loose or Misaligned</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea id="notes" placeholder="e.g., 'Hairline crack on the western-facing side...'" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <Button onClick={startScanning} className="w-full" disabled={!defectType}>
                <Icons.scanLine className="mr-2 h-4 w-4" />
                Proceed to Scan
              </Button>
              <Button variant="outline" className="w-full" onClick={() => { setDefectType("none"); startScanning(); }}>
                Skip and Scan a Good Part
              </Button>
            </CardContent>
          </Card>
        )}
        
        {step === "scanning" && (
            <Card>
              <CardContent className="p-6">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                  <div id={qrcodeRegionId} className="w-full h-full" />
                  
                  {hasCameraPermission === null && !isProcessing && (
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

                  {isProcessing && (
                      <div className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center gap-4 p-4">
                          <Loader2 className="w-16 h-16 animate-spin" />
                          <span>Processing...</span>
                      </div>
                  )}

                  {hasCameraPermission === true && !isProcessing && (
                    <div className="absolute inset-0 pointer-events-none">
                        <Icons.scanFrame className="w-full h-full text-primary/50" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardHeader className="pt-0 px-6 pb-6 text-center">
                    <Button variant="outline" className="w-full" onClick={handleFileUploadClick} disabled={isProcessing}>
                        <Icons.upload className="mr-2 h-5 w-5" />
                        Or Upload a QR Code Image
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <div id="qr-reader-container-hidden" className="hidden"></div>
                   <CardDescription className="mt-4">
                      Place the QR code inside the frame. Good lighting improves accuracy.
                   </CardDescription>
                   <Button variant="link" onClick={() => { setStep("pre-scan"); setHasCameraPermission(null); }}>
                        Go Back
                   </Button>
              </CardHeader>
            </Card>
        )}
        </div>
      </div>
    </AppLayout>
  );
}
