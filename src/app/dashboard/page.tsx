
"use client";

import Link from "next/link";
import Image from "next/image";
import { getParts } from "@/lib/data";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/app-layout";
import type { Part } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Icons } from "@/components/icons";
import { Info } from "lucide-react";

function getLatestStatus(part: Part): string {
  if (!part.inspections || part.inspections.length === 0) {
    return "Not Inspected";
  }
  const latestInspection = part.inspections.sort(
    (a, b) => new Date(b.insp_date).getTime() - new Date(a.insp_date).getTime()
  )[0];
  return latestInspection.status;
}

export default function DashboardPage() {
  const [parts, setParts] = useState<Part[]>([]);
  
  useEffect(() => {
    async function loadParts() {
      const partsData = await getParts();
      setParts(partsData);
    }
    loadParts();
  }, []);

  const categories = [
    { name: "Sleepers", type: "sleeper", description: "Concrete and wooden supports", imageHint: "railway sleeper" },
    { name: "Clips", type: "rail_clip", description: "Fasteners for securing rails", imageHint: "railway track" },
    { name: "Pads", type: "rail_pad", description: "Resilient pads for vibration damping", imageHint: "rail pad" },
    { name: "Liners", type: "liner", description: "Insulating and positioning components", imageHint: "rail liner" },
  ];
  
  const getCategoryStats = (partType: string) => {
    const relevantParts = parts.filter(p => p.part_type === partType);
    const attentionCount = relevantParts.filter(p => {
        const status = getLatestStatus(p);
        return status === 'Failed' || status === 'Needs Repair';
    }).length;
    return {
        total: relevantParts.length,
        attention: attentionCount
    };
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-headline">
              Inventory Categories
            </h2>
            <p className="text-muted-foreground mt-1">
              Browse parts by category to check status and manage your stock.
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0">
            <Link href="/scan">
              <Icons.scanLine className="mr-2 h-4 w-4" />
              Scan New Part
            </Link>
          </Button>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Data Source</AlertTitle>
          <AlertDescription>
            Part data is retrieved from connected UDM and TMS portals to provide you with the latest information.
            <div className="mt-2">
                <Button asChild variant="outline" size="sm">
                    <Link href="/udm-portal/login">
                        Connect to UDM portal
                    </Link>
                </Button>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const stats = getCategoryStats(category.type);
            const categoryImage = PlaceHolderImages.find(img => img.id === category.type);
            
            return (
              <Link href={`/dashboard/parts?type=${category.type}`} key={category.name}>
                <Card className="group flex flex-col overflow-hidden rounded-xl h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                   <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                      {categoryImage && (
                        <Image 
                          src={categoryImage.imageUrl} 
                          alt={category.description} 
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={categoryImage.imageHint}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                         <h3 className="font-headline text-2xl font-bold text-white">
                           {category.name}
                         </h3>
                      </div>
                   </div>
                  <CardContent className="p-4 flex flex-col flex-grow bg-card">
                     <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                    <div className="flex-grow" />
                     <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <Icons.folder className="w-5 h-5 text-muted-foreground"/>
                            <span className="font-medium">{stats.total}</span>
                            <span className="text-muted-foreground">Parts</span>
                        </div>
                        <div className={cn("flex items-center gap-2", stats.attention > 0 ? 'text-destructive' : 'text-green-600')}>
                            <Icons.shieldAlert className="w-5 h-5"/>
                            <span className="font-medium">{stats.attention}</span>
                           <span className="">Needs Attention</span>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
