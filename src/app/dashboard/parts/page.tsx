
"use client";

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getParts } from '@/lib/data';
import type { Part } from '@/lib/types';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from '@/components/icons';
import { CheckCircle2, File, Filter, List, XCircle, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusIcons: Record<string, React.ReactNode> = {
  Passed: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  Failed: <XCircle className="h-4 w-4 text-red-500" />,
  "Needs Repair": <Wrench className="h-4 w-4 text-yellow-500" />,
  "Not Inspected": <File className="h-4 w-4 text-gray-500" />,
};

const statusBadgeVariants: Record<string, "default" | "destructive" | "secondary"> = {
    Passed: "default",
    Failed: "destructive",
    "Needs Repair": "secondary",
    "Not Inspected": "secondary",
};


function getLatestStatus(part: Part): string {
  if (part.inspections.length === 0) return "Not Inspected";
  const latestInspection = part.inspections.sort(
    (a, b) => new Date(b.insp_date).getTime() - new Date(a.insp_date).getTime()
  )[0];
  return latestInspection.status;
}

const ALL_STATUSES = ["Passed", "Failed", "Needs Repair", "Not Inspected"];


function PartsList() {
    const searchParams = useSearchParams();
    const partType = searchParams.get('type');
    const [parts, setParts] = useState<Part[]>([]);
    const [filteredParts, setFilteredParts] = useState<Part[]>([]);
    const [statusFilters, setStatusFilters] = useState<string[]>([]);


    useEffect(() => {
        async function loadParts() {
            const allParts = await getParts();
            setParts(allParts);
        }
        loadParts();
    }, []);

    useEffect(() => {
        let tempParts = partType ? parts.filter(p => p.part_type === partType) : [...parts];

        if (statusFilters.length > 0) {
            tempParts = tempParts.filter(p => statusFilters.includes(getLatestStatus(p)));
        }

        setFilteredParts(tempParts);
    }, [partType, parts, statusFilters]);
    
    const title = partType ? `${partType.replace(/_/g, ' ')} Parts` : 'All Parts';

    const handleStatusFilterChange = (status: string) => {
        setStatusFilters(prev => 
            prev.includes(status) 
                ? prev.filter(s => s !== status) 
                : [...prev, status]
        );
    };

    return (
        <AppLayout>
            <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                    <h1 className="font-headline text-3xl font-bold capitalize">{title}</h1>
                    <p className="text-muted-foreground">
                        Showing {filteredParts.length} of {partType ? parts.filter(p => p.part_type === partType).length : parts.length} parts.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter Status
                                {statusFilters.length > 0 && <span className="ml-2 rounded-full bg-primary px-2 text-xs text-primary-foreground">{statusFilters.length}</span>}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {ALL_STATUSES.map(status => (
                                 <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={statusFilters.includes(status)}
                                    onCheckedChange={() => handleStatusFilterChange(status)}
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">
                            <Icons.arrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <div>
                            <CardTitle className='flex items-center gap-2'>
                                <List />
                                Inventory List
                            </CardTitle>
                            <CardDescription>A complete list of all parts in this category.</CardDescription>
                        </div>
                         {statusFilters.length > 0 && (
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                               <span>Active Filters:</span>
                               <div className='flex gap-1'>
                                {statusFilters.map(filter => (
                                    <Badge key={filter} variant={statusBadgeVariants[filter]}>{filter}</Badge>
                                ))}
                               </div>
                                <Button variant="ghost" size="sm" onClick={() => setStatusFilters([])} className="h-auto px-1 py-0.5">Clear</Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Part Name</TableHead>
                                <TableHead>QR ID</TableHead>
                                <TableHead>Lot No.</TableHead>
                                <TableHead>Latest Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredParts.length > 0 ? (
                                filteredParts.map(part => {
                                    const status = getLatestStatus(part);
                                    return (
                                        <TableRow key={part.qr_id}>
                                            <TableCell className="font-medium">{part.part_name}</TableCell>
                                            <TableCell className="font-mono text-xs">{part.qr_id}</TableCell>
                                            <TableCell>{part.lot_no}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {statusIcons[status]}
                                                    <Badge variant={statusBadgeVariants[status]}>
                                                        {status}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/parts/${part.qr_id}`}>View Details</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No parts found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AppLayout>
    );
}


export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PartsList />
        </Suspense>
    )
}
