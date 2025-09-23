"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader, QrCode } from "lucide-react";
import { getParts } from "@/lib/data";
import type { Part } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export function QrScanner() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [parts, setParts] = useState<Part[]>([]);
  const [status, setStatus] = useState<
    "idle" | "scanning" | "success" | "error"
  >("idle");
  const [scannedPart, setScannedPart] = useState<Part | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);


  useEffect(() => {
    async function fetchParts() {
      const allParts = await getParts();
      setParts(allParts);
    }
    fetchParts();
  }, []);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (status !== 'scanning') return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setStatus('error');
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop the video stream
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [status, toast]);


  useEffect(() => {
    let scanTimeout: NodeJS.Timeout;
    let redirectTimeout: NodeJS.Timeout;

    if (status === "scanning" && hasCameraPermission) {
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
          toast({
            variant: "destructive",
            title: "Scan Error",
            description: "Could not find any parts in the database.",
          });
        }
      }, 2500);
    }

    return () => {
      clearTimeout(scanTimeout);
      clearTimeout(redirectTimeout);
    };
  }, [status, parts, router, hasCameraPermission, toast]);

  const handleStartScan = () => {
    setStatus("scanning");
  };

  const renderStatusOverlay = () => {
    switch (status) {
      case "scanning":
        if (!hasCameraPermission) {
           return (
             <>
               <Loader className="h-12 w-12 animate-spin text-primary" />
               <p className="mt-4 text-lg font-medium">Requesting camera access...</p>
             </>
           );
        }
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
         if (!hasCameraPermission) return null; // Error toast is shown instead
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
    <>
      <div className="relative flex aspect-video w-full max-w-2xl mx-auto items-center justify-center overflow-hidden rounded-lg border bg-card shadow-lg">
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity",
            status === 'scanning' && hasCameraPermission ? 'opacity-100' : 'opacity-0'
          )}
          autoPlay
          muted
          playsInline
        />

        <div
          className={cn(
            "absolute inset-0 bg-slate-900/50 transition-opacity",
            status === 'idle' ? 'opacity-0' : 'opacity-100',
            status === 'scanning' && hasCameraPermission ? 'bg-transparent' : 'bg-slate-900',
          )}
        >
          { status === 'scanning' && hasCameraPermission && (
             <div className="absolute top-1/2 left-1/2 h-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-primary/50 shadow-[0_0_20px_10px_theme(colors.primary/0.1)]">
                <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-primary rounded-tl-md"></div>
                <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-primary rounded-tr-md"></div>
                <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-primary rounded-bl-md"></div>
                <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-primary rounded-br-md"></div>
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-[scanner_3s_ease-in-out_infinite]"></div>
            </div>
          )}
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white p-4">
          {renderStatusOverlay()}
        </div>

        <style jsx>{`
          @keyframes scanner {
            0%, 100% { transform: translateY(-100px); opacity: 0.5; }
            50% { transform: translateY(100px); opacity: 1; }
          }
        `}</style>
      </div>

       { status === 'scanning' && !hasCameraPermission && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertTitle>Camera Access Required</AlertTitle>
            <AlertDescription>
              Please allow camera access in your browser to use the scanner. If you've denied it, you may need to reset permissions in your browser settings.
            </AlertDescription>
          </Alert>
        )}
    </>
  );
}
