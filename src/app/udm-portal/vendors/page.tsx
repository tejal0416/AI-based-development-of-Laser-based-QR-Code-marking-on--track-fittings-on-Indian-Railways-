
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bell, Box, Building, FileText, PlusCircle, Search, Settings, ShieldAlert, Siren, Users, Warehouse, LogOut } from "lucide-react";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const vendors = [
  { vendorId: "VEND-001", companyName: "SteelTech Industries", contact: "info@steeltech.com", productType: "Rail Components", certifications: "ISO 9001", status: "Active" },
  { vendorId: "VEND-002", companyName: "Bharat Fasteners Ltd.", contact: "contact@bharatfast.com", productType: "Fasteners", certifications: "ISO 9001, RDSO Approved", status: "Active" },
  { vendorId: "VEND-003", companyName: "Metro Cast Pvt. Ltd.", contact: "sales@metrocast.in", productType: "Liners & Pads", certifications: "ISO 9001", status: "Active" },
  { vendorId: "VEND-004", companyName: "InfraBuild Group", contact: "support@infrabuild.com", productType: "Sleepers", certifications: "ISO 14001", status: "Onboarding" },
];

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  "Active": "default",
  "Onboarding": "secondary",
  "Inactive": "outline",
}

export default function UdmVendorsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-card sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="#" className="flex items-center gap-2 font-semibold">
            <Icons.logo className="h-6 w-6 text-blue-600" />
            <span>UDM Portal</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
            <div className="grid items-start px-4 text-sm font-medium">
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" href="/udm-portal"><Box className="h-4 w-4"/> Dashboard</Link>
                <Link className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary" href="/udm-portal/vendors"><Building className="h-4 w-4"/> Vendors</Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" href="#"><Warehouse className="h-4 w-4"/> Supplies</Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" href="#"><ShieldAlert className="h-4 w-4"/> Inspections</Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" href="#"><Siren className="h-4 w-4"/> Warranty</Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" href="#"><FileText className="h-4 w-4"/> Reports</Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" href="#"><Users className="h-4 w-4"/> Complaint Center</Link>
            </div>
        </nav>
        <div className="mt-auto p-4 border-t">
            <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" href="#"><Settings className="h-4 w-4"/> Settings</Link>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search by Vendor Name, ID, or Product..." className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]" />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/admin/40/40" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin User</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-headline tracking-tight">Vendor Management</h1>
                    <p className="text-muted-foreground">Approve, monitor, and manage all railway component suppliers.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register New Vendor
                </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Registered Vendors</CardTitle>
                <CardDescription>A complete list of all approved and pending vendors.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor ID</TableHead>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Contact Email</TableHead>
                      <TableHead>Product Type</TableHead>
                      <TableHead>Certifications</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.vendorId}>
                        <TableCell className="font-mono text-xs">{vendor.vendorId}</TableCell>
                        <TableCell className="font-medium">{vendor.companyName}</TableCell>
                        <TableCell>{vendor.contact}</TableCell>
                        <TableCell>{vendor.productType}</TableCell>
                        <TableCell>{vendor.certifications}</TableCell>
                        <TableCell><Badge variant={statusVariant[vendor.status]}>{vendor.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
