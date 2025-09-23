"use client";

import Link from "next/link";
import Image from "next/image";
import { getParts } from "@/lib/data";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/app-layout";
import type { Part } from "@/lib/types";
import { QrCode, Search, ListFilter, ArrowUpDown, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const statusStyles: Record<string, {
  variant: "default" | "destructive";
  icon: React.ReactNode;
  label: string;
  className: string;
}> = {
  "Passed": {
    variant: "default",
    icon: <CheckCircle className="h-4 w-4" />,
    label: "Passed",
    className: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20",
  },
  "Failed": {
    variant: "destructive",
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "Requires Attention",
    className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
  },
  "Needs Repair": {
    variant: "destructive",
    icon: <AlertTriangle className="h-4 w-4" />,
    label: "Requires Attention",
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20",
  },
  "Not Inspected": {
     variant: "destructive",
     icon: <XCircle className="h-4 w-4" />,
     label: "Not Inspected",
     className: "bg-gray-500/10 text-gray-600 border-gray-500/20 hover:bg-gray-500/20",
  }
};

const partTypeStyles: Record<string, {
  gradient: string;
  textColor: string;
}> = {
    "rail_pad": {
        gradient: "from-blue-100 to-blue-200",
        textColor: "text-blue-800",
    },
    "sleeper": {
        gradient: "from-purple-100 to-purple-200",
        textColor: "text-purple-800",
    },
    "rail_clip": {
        gradient: "from-pink-100 to-pink-200",
        textColor: "text-pink-800",
    },
    "default": {
        gradient: "from-gray-100 to-gray-200",
        textColor: "text-gray-800",
    }
}


function getLatestStatus(part: Part): string {
  if (part.inspections.length === 0) return "Not Inspected";
  const latestInspection = part.inspections.sort(
    (a, b) => new Date(b.insp_date).getTime() - new Date(a.insp_date).getTime()
  )[0];
  return latestInspection.status;
}

export default function DashboardPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadParts() {
      const partsData = await getParts();
      setParts(partsData);
      setFilteredParts(partsData);
    }
    loadParts();
  }, []);

  useEffect(() => {
    const results = parts.filter(part =>
      part.part_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.qr_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.part_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.lot_no.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParts(results);
  }, [searchTerm, parts]);


  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline">
              Parts Inventory
            </h2>
            <p className="text-muted-foreground mt-1">
              Track status, review details, and scan new components into your inventory.
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0">
            <Link href="/scan">
              <QrCode className="mr-2 h-4 w-4" />
              Scan New Part
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parts, IDs, materials"
              className="pl-9 w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
             <ListFilter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="h-4 w-4" /> Sort by: Recent
          </Button>
          <div className="ml-auto flex items-center gap-2">
             <Button variant="outline" size="sm" className="bg-gray-100">Passed</Button>
             <Button variant="outline" size="sm" className="bg-gray-100">Requires Attention</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredParts.map((part) => {
            const latestStatus = getLatestStatus(part);
            const statusStyle = statusStyles[latestStatus];
            const partImage = PlaceHolderImages.find(img => img.id === part.part_type);
            const partTypeStyle = partTypeStyles[part.part_type] || partTypeStyles.default;

            return (
              <Card key={part.qr_id} className="flex flex-col overflow-hidden rounded-xl">
                 <div className="relative aspect-[4/3] bg-muted">
                    {partImage ? (
                      <Image 
                        src={partImage.imageUrl} 
                        alt={partImage.description} 
                        fill
                        className="object-cover"
                        data-ai-hint={partImage.imageHint}
                      />
                    ) : (
                       <div className={cn("flex items-center justify-center h-full bg-gradient-to-br", partTypeStyle.gradient)}>
                        <p className={cn("font-display text-4xl font-bold tracking-wider uppercase", partTypeStyle.textColor)}>
                          {part.part_type.replace('_', ' ')}
                        </p>
                      </div>
                    )}
                 </div>
                <CardContent className="p-4 flex flex-col flex-grow bg-white">
                  <h3 className="font-headline text-lg font-semibold leading-tight">
                    {part.part_name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {`Batch #${part.lot_no.slice(-4)} • ${part.part_type.replace('_', ' ')}`}
                  </p>
                  <div className="flex-grow my-4" />
                   <div className="flex items-center justify-between gap-4">
                    <Badge variant={statusStyle.variant} className={statusStyle.className}>
                       {statusStyle.icon}
                       {statusStyle.label}
                    </Badge>
                     <Button asChild variant="ghost" size="sm" className="text-muted-foreground bg-gray-100 hover:bg-gray-200">
                        <Link href={`/parts/${part.qr_id}`}>
                        View Details
                        </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
