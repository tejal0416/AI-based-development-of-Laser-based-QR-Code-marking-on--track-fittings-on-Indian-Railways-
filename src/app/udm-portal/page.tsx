
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bell, Box, Building, FileText, Search, Settings, ShieldAlert, Siren, Users, Warehouse, LogOut, Upload, Mail, Send, Power } from "lucide-react";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, LineChart, Line, Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Sample Data
const summaryCards = [
  { title: "Zones/PUs working", value: "28", icon: <Warehouse className="h-6 w-6 text-blue-500" />, color: "text-blue-500" },
  { title: "User Depots working", value: "1797", icon: <Building className="h-6 w-6 text-green-500" />, color: "text-green-500" },
  { title: "Transactions today", value: "45764", icon: <ShieldAlert className="h-6 w-6 text-orange-500" />, color: "text-orange-500" },
];

const receiptData = [
    {name: 'Item 1', value: 5},
    {name: 'Item 2', value: 4},
    {name: 'Item 3', value: 3},
    {name: 'Item 4', value: 2},
    {name: 'Item 5', value: 1},
];

const issueData = [
    {name: 'Item A', value: 3},
    {name: 'Item B', value: 2},
    {name: 'Item C', value: 1},
    {name: 'Item D', value: 1},
    {name: 'Item E', value: 1},
];

const monthWiseData = [
  { name: 'Jan-2022', receipt: 4000, issue: 2400 },
  { name: 'Feb-2022', receipt: 3000, issue: 1398 },
  { name: 'Mar-2022', receipt: 2000, issue: 9800 },
  { name: 'Apr-2022', receipt: 2780, issue: 3908 },
  { name: 'May-2022', receipt: 1890, issue: 4800 },
  { name: 'Jun-2022', receipt: 2390, issue: 3800 },
];

const vendors = [
    "SteelTech Industries", 
    "Bharat Fasteners Ltd.", 
    "Metro Cast Pvt. Ltd.", 
    "InfraBuild Group"
];

const chartConfig = {
    receipt: { label: "Receipt Value", color: "hsl(var(--chart-2))" },
    issue: { label: "Issue Value", color: "hsl(var(--chart-1))" },
}


export default function UdmPortalPage() {
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
                    <Link className="flex items-center gap-3 rounded-lg bg-red-100 px-3 py-2 text-red-700 font-bold transition-all" href="/udm-portal"><Box className="h-4 w-4"/> Homepage</Link>
                    <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 font-semibold mt-2"><Building className="h-4 w-4"/> User Depot Module</span>
                    <div className="ml-6 flex flex-col gap-1 text-gray-500">
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">DMTR</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">Ledger</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">Receipt</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">Acceptance</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">CRN (Digitally-signed)</Link>
                        <Link className="px-3 py-1 hover:text-blue-700" href="#">CRC (Digitally-signed)</Link>
                    </div>
                     <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-blue-700 mt-4" href="/udm-portal/vendors"><Users className="h-4 w-4"/> Vendor Management</Link>
                </div>
            </nav>
        </aside>

        <main className="flex-1 sm:pl-64 pt-28">
            <div className="p-4">
                <div className="bg-blue-900 text-white p-2 rounded-t-md text-sm">
                    Northern Railway, Unit Type: Division, Unit: Ambala Division, Department: Electrical, Consignee: A6949-SSE/AC/CDG
                </div>
                <div className="bg-white p-4 rounded-b-md shadow-md">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="font-bold text-red-600">LIVE</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 md:gap-8 mb-8">
                        {summaryCards.map((card) => (
                        <Card key={card.title} className="text-center">
                            <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="text-center text-md">Month-wise Value of Receipt & Issue (Last 6 months)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={monthWiseData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis label={{ value: 'Value (Rs. in Lakhs)', angle: -90, position: 'insideLeft' }} fontSize={12} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="receipt" name="Receipt Value" stroke="#3b82f6" />
                                    <Line type="monotone" dataKey="issue" name="Issue Value" stroke="#ef4444" />
                                </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-center text-sm">High Receipt Value Items in last 6 months (Top 5)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <BarChart data={receiptData} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis type="category" dataKey="name" hide />
                                            <Bar dataKey="value" fill="#82ca9d" background={{ fill: '#eee' }} barSize={15} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-center text-sm">High Issue Value Items in last 6 months (Top 5)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={150}>
                                        <BarChart data={issueData} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis type="category" dataKey="name" hide />
                                            <Bar dataKey="value" fill="#f97316" background={{ fill: '#eee' }} barSize={15} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full md:w-auto mt-8">
                                <Users className="mr-2 h-4 w-4"/>
                                Register Complaint Against Vendor
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Register Complaint</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to submit a complaint against a vendor.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vendor" className="text-right">
                                    Vendor
                                    </Label>
                                    <Select>
                                        <SelectTrigger id="vendor" className="col-span-3">
                                            <SelectValue placeholder="Select a vendor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vendors.map((vendor) => (
                                                <SelectItem key={vendor} value={vendor.toLowerCase().replace(/ /g, '-')}>{vendor}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="complaint" className="text-right">
                                    Complaint
                                    </Label>
                                    <Textarea id="complaint" placeholder="Please describe the issue in detail." className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="evidence" className="text-right">
                                    Evidence
                                    </Label>
                                    <div className="col-span-3">
                                        <Button asChild variant="outline" className="w-full">
                                            <label htmlFor="file-upload" className="cursor-pointer">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload File (Optional)
                                                <input id="file-upload" type="file" className="sr-only" />
                                            </label>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="submit">Submit Complaint</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
