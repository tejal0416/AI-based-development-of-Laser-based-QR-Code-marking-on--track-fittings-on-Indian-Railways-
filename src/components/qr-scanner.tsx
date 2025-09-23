
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
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (videoDevices.length > 0) {
          await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
        } else {
           setHasCameraPermission(false);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);
  

  useEffect(() => {
    if (!hasCameraPermission) {
      return;
    }

    const html5Qrcode = new Html5Qrcode(qrcodeRegionId);
    scannerRef.current = html5Qrcode;

    const onScanSuccess = (decodedText: string) => {
      onPartDetect(decodedText);
    };

    const onScanFailure = (error: any) => {
      // ignore scan failure
    };

    html5Qrcode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 150, height: 150 }
      },
      onScanSuccess,
      onScanFailure
    ).catch(err => {
      console.error("Scanner start error", err);
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
