"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader, QrCode } from "lucide-react";
import { getParts } from "@/lib/data";
import type { Part } from "@/lib/types";
import { cn } from "@/lib/utils";

export function QrScanner() {
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [status, setStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");
  const [scannedPart, setScannedPart] = useState<Part | null>(null);

  useEffect(() => {
    async function fetchParts() {
      const allParts = await getParts();
      setParts(allParts);
    }
    fetchParts();
  }, []);

  useEffect(() => {
    let scanTimeout: NodeJS.Timeout;
    let redirectTimeout: NodeJS.Timeout;

    if (status === "scanning") {
      scanTimeout = setTimeout(() => {
        if (parts.length > 0) {
          // Select a random part to "scan"
          const randomPart = parts[Math.floor(Math.random() * parts.length)];
          setScannedPart(randomPart);
          setStatus("success");
          
          redirectTimeout = setTimeout(() => {
            router.push(`/parts/${randomPart.id}`);
          }, 1500);
        } else {
          setStatus("error");
        }
      }, 2500);
    }

    return () => {
      clearTimeout(scanTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [status, parts, router]);

  const handleStartScan = () => {
    setStatus("scanning");
  };

  const renderStatus = () => {
    switch (status) {
      case "scanning":
        return (
          <>
            <Loader className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium">Scanning for QR Code...</p>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="mt-4 text-lg font-medium">
              Scan successful!
            </p>
            <p className="text-muted-foreground">Redirecting to part details...</p>
          </>
        );
      case "error":
        return (
          <>
            <p className="text-destructive">Could not find a part to scan.</p>
          </>
        );
      case "idle":
      default:
        return (
            <button onClick={handleStartScan} className="flex flex-col items-center group">
                <QrCode className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="mt-4 text-lg font-medium text-muted-foreground group-hover:text-primary transition-colors">Tap to start scanning</p>
            </button>
        );
    }
  };

  return (
    <div className="relative flex aspect-video w-full max-w-2xl mx-auto items-center justify-center overflow-hidden rounded-lg border bg-card shadow-lg">
      <div
        className={cn(
          "absolute inset-0 bg-slate-900 transition-opacity",
          status === 'idle' ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900"></div>
        <div className="absolute top-1/2 left-1/2 h-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-primary/50 shadow-[0_0_20px_10px_theme(colors.primary/0.1)]">
            <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-primary rounded-tl-md"></div>
            <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-primary rounded-tr-md"></div>
            <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-primary rounded-bl-md"></div>
            <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-primary rounded-br-md"></div>
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-[scanner_3s_ease-in-out_infinite]"></div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-4">
        {renderStatus()}
      </div>

      <style jsx>{`
        .bg-grid-slate-800 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 41 59 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        @keyframes scanner {
          0%, 100% { transform: translateY(-100px); opacity: 0.5; }
          50% { transform: translateY(100px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
