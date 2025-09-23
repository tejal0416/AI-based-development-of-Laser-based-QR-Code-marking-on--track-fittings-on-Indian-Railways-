"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getPartByQrId } from "@/lib/data";
import { Loader, CheckCircle, XCircle } from "lucide-react";

export function QrScanner() {
  const scannerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [scanStatus, setScanStatus] = useState<"scanning" | "success" | "error" | "idle">("idle");
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (!scannerRef.current || scanner) return;

    const qrScanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
        useExtractedVideoElement: true,
      },
      false
    );

    const onScanSuccess = async (decodedText: string) => {
      if (scanStatus === "success") return;
      
      qrScanner.clear();
      setScanStatus("success");
      
      try {
        // Since we are not using an API route anymore, we can call the data function directly
        const part = await getPartByQrId(decodedText);
        
        if (!part) {
            throw new Error('Part not found');
        }
        
        toast({
            title: "Scan Successful",
            description: `Part found: ${part.part_name}. Redirecting...`,
        });

        setTimeout(() => {
            router.push(`/parts/${part.qr_id}`);
        }, 1500)


      } catch (error) {
        console.error("Failed to fetch part data:", error);
        setScanStatus("error");
        toast({
          variant: "destructive",
          title: "Invalid QR Code",
          description: "This QR code does not correspond to a valid part.",
        });
         setTimeout(() => {
           window.location.reload();
        }, 2500)
      }
    };

    const onScanFailure = (error: any) => {
        // Continuous scanning, so we don't need to do much here.
    };

    qrScanner.render(onScanSuccess, onScanFailure);
    setScanner(qrScanner);
    setScanStatus("scanning");


    return () => {
        qrScanner.clear().catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const renderOverlay = () => {
    switch(scanStatus) {
        case 'success':
            return (
                <div className="absolute inset-0 bg-green-900/80 flex flex-col items-center justify-center text-white z-20">
                    <CheckCircle className="w-16 h-16 mb-4"/>
                    <h2 className="text-2xl font-bold">Scan Successful</h2>
                    <p>Redirecting to part details...</p>
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
    <div className="relative aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-lg border bg-card shadow-lg">
        {renderOverlay()}
        <div id="reader" ref={scannerRef} className="w-full h-full [&>span]:hidden [&>div>button]:hidden [&>div>span]:hidden"></div>
    </div>
  );
}
