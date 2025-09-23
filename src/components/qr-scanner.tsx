
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getPartByQrId } from "@/lib/data";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import type { Part } from "@/lib/types";


interface QrScannerProps {
    onPartDetect: (part: Part) => void;
}


export function QrScanner({ onPartDetect }: QrScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [scanStatus, setScanStatus] = useState<"scanning" | "success" | "error" | "idle">("idle");
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  const onScanSuccess = async (decodedText: string) => {
    if (scanStatus === "success") return;
    
    try {
      const part = await getPartByQrId(decodedText);
      
      if (!part) {
          throw new Error('Part not found');
      }
      
      setScanStatus("success");
      onPartDetect(part);
      toast({
          title: "Scan Successful",
          description: `Part found: ${part.part_name}`,
      });

    } catch (error) {
      console.error("Failed to fetch part data:", error);
      setScanStatus("error");
      toast({
        variant: "destructive",
        title: "Invalid QR Code",
        description: "This QR code does not correspond to a valid part.",
      });
    }
  };

  const onScanFailure = (error: any) => {
      // Continuous scanning, so we don't need to do much here.
  };

  useEffect(() => {
    if (!scannerRef.current) return;
    if (scanner) {
        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            console.error("Scanner start error", err);
            setScanStatus("error");
        });
        setScanStatus("scanning");
        return;
    };
    
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const newScanner = new Html5Qrcode("reader-video");
        setScanner(newScanner);
      }
    }).catch(err => {
        console.error("Camera error:", err)
        toast({
          variant: "destructive",
          title: "Camera Error",
          description: "Could not access camera. Please grant permissions and refresh.",
        });
    });

    return () => {
        if(scanner) {
            scanner.stop().catch(() => {});
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanner]);


  const renderOverlay = () => {
    switch(scanStatus) {
        case 'success':
            return (
                <div className="absolute inset-0 bg-green-900/80 flex flex-col items-center justify-center text-white z-20">
                    <CheckCircle className="w-16 h-16 mb-4"/>
                    <h2 className="text-2xl font-bold">Scan Successful</h2>
                </div>
            )
        case 'error':
             return (
                <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center text-white z-20">
                    <XCircle className="w-16 h-16 mb-4"/>
                    <h2 className="text-2xl font-bold">Invalid QR Code</h2>
                    <p>Scan a valid part QR code to continue.</p>
                </div>
            )
        case 'idle':
             return (
                <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center text-white z-20">
                    <Loader className="w-16 h-16 mb-4 animate-spin"/>
                    <h2 className="text-2xl font-bold">Initializing Scanner...</h2>
                </div>
            )
        default:
            return null;
    }
  }

  return (
    <div className="relative w-full h-full" ref={scannerRef}>
        {renderOverlay()}
        <div id="reader" className="w-full h-full">
            <video id="reader-video" className="w-full h-full object-cover"></video>
        </div>
    </div>
  );
}
