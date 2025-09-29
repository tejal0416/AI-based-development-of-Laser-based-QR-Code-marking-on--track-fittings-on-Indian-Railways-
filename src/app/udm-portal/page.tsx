
"use client";

import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Truck, ShieldCheck, QrCode } from "lucide-react";
import { Icons } from "@/components/icons";

export default function UdmPortalPage() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Vendor Management",
      description: "Register, approve, and manage vendor information and certifications.",
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Supply Chain Tracking",
      description: "Track material supply details from manufacture to delivery with unique IDs.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Inspection & Quality",
      description: "Log inspection records, upload test reports, and manage quality control.",
    },
    {
      icon: <QrCode className="h-8 w-8 text-primary" />,
      title: "Warranty & QR Integration",
      description: "Auto-calculate warranty expiry and scan QR codes to fetch part details.",
    },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Icons.logo className="h-12 w-12 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Unified Digital Management (UDM) Portal
                    </h1>
                    <p className="text-muted-foreground mt-1">
                    A centralized platform for Indian Railways to manage the entire vendor supply chain.
                    </p>
                </div>
            </div>
            <Button variant="outline" asChild>
                <Link href="/dashboard">
                    <Icons.arrowLeft className="mr-2 h-4 w-4" />
                    Back to RailWatch
                </Link>
            </Button>
        </div>

        <div className="p-8 bg-card border rounded-xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold font-headline">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Welcome to the UDM Portal</CardTitle>
                <CardDescription>
                    This portal is a proof-of-concept homepage. In a full application, each section would lead to detailed management interfaces for admins, vendors, and inspectors.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                 <Button>
                    Login to Portal
                 </Button>
                 <Button variant="secondary">
                    Register as a Vendor
                 </Button>
            </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
