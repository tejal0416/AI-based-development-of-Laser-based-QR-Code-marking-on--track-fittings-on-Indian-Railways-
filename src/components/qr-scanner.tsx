
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getPartByQrId } from "@/lib/data";

const qrcodeRegionId = "html5qr-code-full-region";

export function QrScanner() {
  const router = useRouter();
  const { toast } = useToast();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scannerRef.current) {
        return;
    }
    
    const onScanSuccess = (decodedText: string, decodedResult: any) => {
        scannerRef.current?.clear();
        (async () => {
            try {
                const part = await getPartByQrId(decodedText);
                if (part) {
                    toast({
                        title: "Scan Successful",
                        description: `Part found: ${part.part_name}`,
                    });
                    setTimeout(() => {
                        router.push(`/parts/${part.qr_id}`);
                    }, 1500);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Invalid QR Code",
                        description: "This QR code does not correspond to a valid part.",
                    });
                }
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch part data.",
                });
            }
        })();
    };

    const onScanFailure = (error: any) => {
        // handle scan failure, usually better to ignore and keep scanning.
    };

    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 }
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, false);
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = html5QrcodeScanner;

    return () => {
        scannerRef.current?.clear().catch(() => {});
    };
  }, [router, toast]);

  return <div id={qrcodeRegionId} className="w-full h-full" />;
}
