
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Moon, Sun, Minus, Plus } from "lucide-react";

export default function UdmLoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/udm-portal");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-[#0b2f51] text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl">GeM</span>
                    <span className="text-gray-400">|</span>
                    <span className="font-bold text-xl">IREPS</span>
                </div>
                <div>
                    <p className="text-sm font-semibold">Government eMarketplace</p>
                    <p className="text-xs text-yellow-400">Indian Railways E-Procurement System</p>
                    <p className="text-xs">User Depot Module</p>
                </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <button className="hover:text-yellow-400">A-</button>
                <button className="hover:text-yellow-400">A</button>
                <button className="hover:text-yellow-400">A+</button>
                <Moon className="w-5 h-5 cursor-pointer hover:text-yellow-400" />
                <Sun className="w-5 h-5 cursor-pointer hover:text-yellow-400" />
            </div>
        </div>
        <div className="bg-white text-black">
            <div className="container mx-auto px-4">
                <button className="p-2 hover:bg-gray-200">
                    <Home className="w-5 h-5" />
                </button>
            </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto border-t-4 border-red-600">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Authenticate Yourself</h2>
                <p className="text-sm text-gray-600">(For Consignee Stores Users)</p>
              </div>
              <Link href="#" className="text-sm text-red-600 font-semibold hover:underline">
                Test IREPS Applet
              </Link>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="username" className="text-right">User Name</Label>
                <Input id="username" className="col-span-2 max-w-sm" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input id="password" type="password" className="col-span-2 max-w-sm" />
              </div>
              <div className="pl-1/3 ml-[calc(33.33%+1rem)] flex items-center gap-2">
                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Login</Button>
                 <Button type="button" variant="outline" onClick={() => router.push('/')}>Home</Button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <p className="text-red-600 font-semibold">User Name and Password are Case Sensitive</p>
              <p className="text-sm text-gray-500">For security reason we have logged your system IP.</p>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-2xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Change your Password</h3>
                    <ul className="list-disc list-inside text-blue-600">
                        <li>
                            <Link href="#" className="hover:underline">Click Here To Reset Password Using DSC</Link>
                        </li>
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Change your Signing Certificate</h3>
                     <ul className="list-disc list-inside text-blue-600">
                        <li>
                            <Link href="#" className="hover:underline">Click Here To Change your Signing Certificate</Link>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
