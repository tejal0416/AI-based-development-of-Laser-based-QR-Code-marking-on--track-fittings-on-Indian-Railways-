
"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Html5QrcodeScannerState } from "html5-qrcode/esm/state-manager";

type QrScannerProps = {
    onPartDetect: (qrId: string) => void;
    videoEl: HTMLVideoElement;
};

const qrcodeRegionId = "html5qr-code-full-region";

export function QrScanner({ onPartDetect, videoEl }: QrScannerProps) {
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        if (!videoEl || !(videoEl.srcObject instanceof MediaStream)) {
            return;
        }

        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(qrcodeRegionId, { verbose: false });
        }
        const html5Qrcode = scannerRef.current;

        const onScanSuccess = (decodedText: string) => {
            if (html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING) {
                html5Qrcode.stop().then(() => {
                    onPartDetect(decodedText);
                }).catch(err => console.error("Failed to stop scanner", err));
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

        if (html5Qrcode.getState() !== Html5QrcodeScannerState.SCANNING) {
             const track = (videoEl.srcObject as MediaStream).getVideoTracks()[0];
             const deviceId = track.getSettings().deviceId;
             if (!deviceId) return;
             
             html5Qrcode.start(
                { deviceId: { exact: deviceId } },
                {
                    fps: 10,
                    qrbox: qrboxFunction,
                    useBarCodeDetectorIfSupported: true,
                },
                onScanSuccess,
                onScanFailure
            ).catch(err => {
                console.error("Error starting scanner", err);
            });
        }


        return () => {
            if (html5Qrcode && html5Qrcode.getState() === Html5QrcodeScannerState.SCANNING) {
                html5Qrcode.stop().catch((err) => {
                    // console.error("Failed to stop QR scanner:", err);
                });
            }
        };
    }, [onPartDetect, videoEl]);

    // The scanner will attach to the videoEl, so we can just return a hidden div for its own DOM element.
    return <div id={qrcodeRegionId} className="absolute inset-0" />;
}

    