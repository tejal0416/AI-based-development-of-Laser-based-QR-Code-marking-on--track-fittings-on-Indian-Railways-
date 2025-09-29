
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bell, Box, Building, FileText, PlusCircle, Search, Settings, ShieldAlert, Siren, Users, Warehouse, LogOut, Mail, Send, Power } from "lucide-react";
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
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
       <header className="bg-white text-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Icons.logo className="h-10 w-10 text-blue-800" />
                <div>
                    <h1 className="text-lg font-bold text-blue-900">Indian Railways E-Procurement System (IREPS)</h1>
                    <h2 className="text-md font-semibold text-blue-800">यूजर डिपो मॉड्यूल User Depot Module (UDM)</h2>
                </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <Mail className="w-5 h-5 cursor-pointer hover:text-blue-700" />
                <Send className="w-5 h-5 cursor-pointer hover:text-blue-700" />
                <Power className="w-5 h-5 cursor-pointer text-red-600 hover:text-red-800" onClick={() => router.push('/login')} />
            </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-white sm:flex mt-28">
            <div className="flex items-center gap-4 px-4 py-2 border-b">
                <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/admin/40/40" />
                    <AvatarFallback>SK</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">SANDEEP KUMAR</p>
                    <p className="text-xs text-gray-600">(SSE/AC/CDG), AMBALA...</p>
                </div>
            </div>
            <nav className="flex-1 overflow-auto py-4">
                <div className="grid items-start px-2 text-sm font-medium">
                    <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-700" href="/udm-portal"><Box className="h-4 w-4"/> Homepage</Link>
                    <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 font-semibold mt-2"><Building className="h-4 w-4"/> User Depot Module</span>
                    <div className="ml-6 flex flex-col gap-1 text-gray-500">
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">DMTR</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">Ledger</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">Receipt</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">Acceptance</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">CRN (Digitally-signed)</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">CRC (Digitally-signed)</Link>
                    </div>
                     <Link className="flex items-center gap-3 rounded-lg bg-red-100 px-3 py-2 text-red-700 font-bold transition-all mt-4" href="/udm-portal/vendors"><Users className="h-4 w-4"/> Vendor Management</Link>
                </div>
            </nav>
        </aside>
        
        <main className="flex-1 sm:pl-64 pt-28">
          <div className="p-4">
             <div className="bg-blue-900 text-white p-2 rounded-t-md text-sm flex justify-between items-center">
                <span>Vendor Management</span>
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input type="search" placeholder="Search..." className="w-full rounded-lg bg-white text-gray-800 pl-8 h-8" />
                </div>
            </div>
            <div className="bg-white p-4 rounded-b-md shadow-md">
                 <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Registered Vendors</h1>
                        <p className="text-gray-500">Approve, monitor, and manage all railway component suppliers.</p>
                    </div>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Register New Vendor
                    </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
