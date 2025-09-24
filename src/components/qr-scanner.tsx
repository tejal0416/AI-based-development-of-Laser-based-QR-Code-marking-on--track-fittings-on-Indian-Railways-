
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader } from "lucide-react";

const qrcodeRegionId = "html5qr-code-full-region";

type QrScannerProps = {
    onPartDetect: (qrId: string) => void;
};

export function QrScanner({ onPartDetect }: QrScannerProps) {
  const { toast } = useToast();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Permission granted, we can stop the stream immediately as the scanner will start it again
        stream.getTracks().forEach(track => track.stop());
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use the scanner.',
        });
      }
    };
    
    // Only request permission if we haven't determined it yet
    if (hasCameraPermission === null) {
      requestCameraPermission();
    }
  }, [toast, hasCameraPermission]);
  

  useEffect(() => {
    // Only start scanner if permission has been granted
    if (hasCameraPermission !== true) {
      return;
    }

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(qrcodeRegionId, { verbose: false });
    }
    const html5Qrcode = scannerRef.current;

    let isScanning = true;

    const onScanSuccess = (decodedText: string) => {
        if (isScanning) {
            isScanning = false;
            onPartDetect(decodedText);
        }
    };

    const onScanFailure = (error: any) => {
      // ignore scan failure
    };
    
    const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.max(250, Math.floor(minEdge * 0.8));
        return {
            width: qrboxSize,
            height: qrboxSize,
        };
    }

    html5Qrcode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: qrboxFunction,
        useBarCodeDetectorIfSupported: true,
      },
      onScanSuccess,
      onScanFailure
    ).catch(err => {
        // Ignore errors, camera might be starting up
    });

    return () => {
      if (html5Qrcode && html5Qrcode.isScanning) {
          html5Qrcode.stop().catch(() => {});
      }
    };
  }, [hasCameraPermission, onPartDetect]);


  if (hasCameraPermission === null) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Loader className="h-8 w-8 animate-spin mb-4" />
            <p>Requesting camera permission...</p>
        </div>
    );
  }

  if (hasCameraPermission === false) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
                Please allow camera access in your browser settings to use the scanner.
            </AlertDescription>
        </Alert>
    );
  }

  return <div id={qrcodeRegionId} className="w-full h-full" />;
}

    