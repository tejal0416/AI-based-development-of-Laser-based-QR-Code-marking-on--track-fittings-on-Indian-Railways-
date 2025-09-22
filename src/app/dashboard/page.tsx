import Link from "next/link";
import Image from "next/image";
import { getParts } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/app-layout";
import type { Part, InspectionStatus } from "@/lib/types";
import { ArrowRight, QrCode } from "lucide-react";

const statusColors: Record<InspectionStatus, string> = {
  Passed: "bg-green-500",
  Failed: "bg-red-500",
  "Requires Attention": "bg-yellow-500",
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
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">
              Parts Inventory
            </h2>
            <p className="text-muted-foreground">
              Overview of all tracked rail parts.
            </p>
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/scan">
              <QrCode className="mr-2 h-4 w-4" />
              Scan New Part
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {parts.map((part) => {
            const latestStatus = getLatestStatus(part);
            return (
              <Card key={part.id} className="flex flex-col">
                <CardHeader>
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md">
                     <Image
                        src={part.imageUrl}
                        alt={part.name}
                        fill
                        className="object-cover"
                        data-ai-hint={part.dataAiHint}
                      />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardTitle className="font-headline text-xl leading-tight">
                    {part.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {part.category}
                  </CardDescription>
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${statusColors[latestStatus]}`}
                    />
                    <Badge variant="outline">{latestStatus}</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/parts/${part.id}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
