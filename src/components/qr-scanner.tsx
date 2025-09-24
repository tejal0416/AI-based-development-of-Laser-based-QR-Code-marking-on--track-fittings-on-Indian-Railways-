
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const qrcodeRegionId = "html5qr-code-full-region";

type QrScannerProps = {
    onPartDetect: (qrId: string) => void;
};

export function QrScanner({ onPartDetect }: QrScannerProps) {
  const { toast } = useToast();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasCameraPermissionRef = useRef<boolean | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
           await navigator.mediaDevices.getUserMedia({ video: true });
           hasCameraPermissionRef.current = true;
           setHasCameraPermission(true);
        } else {
           hasCameraPermissionRef.current = false;
           setHasCameraPermission(false);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        hasCameraPermissionRef.current = false;
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };
    
    if (hasCameraPermissionRef.current === null) {
      getCameraPermission();
    }
  }, [toast]);
  

  useEffect(() => {
    if (hasCameraPermission !== true) {
      return;
    }

    const html5Qrcode = new Html5Qrcode(qrcodeRegionId);
    scannerRef.current = html5Qrcode;

    const onScanSuccess = (decodedText: string) => {
      scannerRef.current?.stop().catch(() => {});
      onPartDetect(decodedText);
    };

    const onScanFailure = (error: any) => {
      // ignore scan failure
    };
    
    const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const qrboxSize = Math.max(50, Math.min(Math.floor(minEdge * 0.8), 250));
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
      },
      onScanSuccess,
      onScanFailure
    ).catch(err => {
      // This can happen if the component unmounts before the scanner starts.
      if (err.name !== "NotAllowedError") {
         console.error("Scanner start error", err);
      }
    });

    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, [hasCameraPermission, onPartDetect]);


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
