import { AppLayout } from "@/components/app-layout";
import { QrScanner } from "@/components/qr-scanner";

export default function ScanPage() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight font-headline">
              Scan Part QR Code
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mt-2">
              Position the QR code within the frame. The scan will start automatically. Make sure you have granted camera permissions.
            </p>
        </div>
        <QrScanner />
      </div>
    </AppLayout>
  );
}
