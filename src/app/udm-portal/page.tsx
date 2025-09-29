
"use client";

import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BarChart, Bell, Box, Building, FileText, PieChart, Search, Settings, ShieldAlert, Siren, Users, Warehouse, LogOut } from "lucide-react";
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, Pie, Cell, ResponsiveContainer } from "recharts";

// Sample Data
const summaryCards = [
  { title: "Total Supplies Registered", value: "12,540", icon: <Warehouse className="h-6 w-6 text-blue-500" />, color: "text-blue-500" },
  { title: "Active Vendors", value: "420", icon: <Building className="h-6 w-6 text-green-500" />, color: "text-green-500" },
  { title: "Pending Inspections", value: "38", icon: <ShieldAlert className="h-6 w-6 text-orange-500" />, color: "text-orange-500" },
  { title: "Expiring Warranties", value: "25", icon: <Siren className="h-6 w-6 text-red-500" />, color: "text-red-500" },
];

const recentActivity = [
  { qrId: "QR003078", partName: "Rail Pad", vendor: "SteelTech Industries", supplyDate: "2024-09-14", expiryDate: "2025-09-14", status: "Active" },
  { qrId: "QR003112", partName: "Elastic Clip", vendor: "Bharat Fasteners Ltd.", supplyDate: "2024-08-02", expiryDate: "2025-08-02", status: "Inspection Pending" },
  { qrId: "QR003205", partName: "Liner", vendor: "Metro Cast Pvt. Ltd.", supplyDate: "2024-07-18", expiryDate: "2025-07-18", status: "Warranty Expiring Soon" },
  { qrId: "QR003341", partName: "Sleeper", vendor: "InfraBuild Group", supplyDate: "2024-09-21", expiryDate: "2026-09-21", status: "Active" },
];

const monthlySuppliesData = [
  { month: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "May", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
  { month: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
];

const inspectionStatusData = [
  { name: "Passed", value: 400, fill: "var(--color-passed)" },
  { name: "Pending", value: 38, fill: "var(--color-pending)" },
  { name: "Failed", value: 15, fill: "var(--color-failed)" },
];
const chartConfig = {
    total: { label: "Total" },
    passed: { label: "Passed" },
    pending: { label: "Pending" },
    failed: { label: "Failed" }
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Active": "default",
  "Inspection Pending": "secondary",
  "Warranty Expiring Soon": "destructive",
}

export default function UdmPortalPage() {
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
                <Link className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary" href="#"><Box className="h-4 w-4"/> Dashboard</Link>
                <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" href="#"><Building className="h-4 w-4"/> Vendors</Link>
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
            <Input type="search" placeholder="Search QR ID, Vendor, or Lot..." className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]" />
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
            <h1 className="text-2xl font-bold font-headline tracking-tight">Unified Digital Management (UDM) – Dashboard</h1>
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  {card.icon}
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full md:w-auto">
             <Users className="mr-2 h-4 w-4"/>
             Register Complaint Against Vendor
          </Button>

          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of the latest supply chain events.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>QR ID</TableHead>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Supply Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map((activity) => (
                      <TableRow key={activity.qrId}>
                        <TableCell className="font-mono text-xs">{activity.qrId}</TableCell>
                        <TableCell>{activity.partName}</TableCell>
                        <TableCell>{activity.vendor}</TableCell>
                        <TableCell>{activity.supplyDate}</TableCell>
                        <TableCell><Badge variant={statusVariant[activity.status]}>{activity.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Supplies</CardTitle>
                        <CardDescription>Last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlySuppliesData}>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Inspection Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie data={inspectionStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                    <Cell key="cell-0" fill="hsl(var(--chart-2))" />
                                    <Cell key="cell-1" fill="hsl(var(--chart-4))" />
                                    <Cell key="cell-2" fill="hsl(var(--chart-1))" />
                                </Pie>
                            </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
