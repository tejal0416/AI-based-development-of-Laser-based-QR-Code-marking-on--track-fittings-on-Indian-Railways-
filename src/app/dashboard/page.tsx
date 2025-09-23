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
import type { Part, InspectionStatus } from "@/lib/types";
import { ArrowRight, QrCode, Search, ListFilter, ArrowUpDown, CheckCircle, AlertTriangle } from "lucide-react";

const statusStyles: Record<InspectionStatus, {
  variant: "default" | "secondary" | "destructive";
  icon: React.ReactNode;
  className: string;
}> = {
  "Passed": {
    variant: "default",
    icon: <CheckCircle className="h-4 w-4" />,
    className: "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20",
  },
  "Failed": {
    variant: "destructive",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20",
  },
  "Requires Attention": {
    variant: "secondary",
    icon: <AlertTriangle className="h-4 w-4" />,
    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20",
  },
};


function getLatestStatus(part: Part): InspectionStatus {
  if (part.inspections.length === 0) return "Requires Attention";
  const latestInspection = part.inspections.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  return latestInspection.status;
}

export default async function DashboardPage() {
  const parts = await getParts();

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">
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
            />
          </div>
          <Button variant="outline" className="gap-2">
             <ListFilter /> Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown /> Sort by: Recent
          </Button>
          <div className="ml-auto flex items-center gap-2">
             <Button variant="outline" size="sm">Passed</Button>
             <Button variant="outline" size="sm">Requires Attention</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {parts.map((part) => {
            const latestStatus = getLatestStatus(part);
            const statusStyle = statusStyles[latestStatus];
            return (
              <Card key={part.id} className="flex flex-col overflow-hidden">
                <div className="relative aspect-[3/2] w-full">
                     <Image
                        src={part.imageUrl}
                        alt={part.name}
                        fill
                        className="object-cover"
                        data-ai-hint={part.dataAiHint}
                      />
                </div>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <h3 className="font-headline text-xl font-semibold leading-tight">
                    {part.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {`Batch #${part.qrId.slice(-4)} • ${part.category}`}
                  </p>
                  <div className="flex-grow" />
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <Badge variant={statusStyle.variant} className={statusStyle.className}>
                       {statusStyle.icon}
                       {latestStatus}
                    </Badge>
                     <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted">
                        <Link href={`/parts/${part.id}`}>
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
