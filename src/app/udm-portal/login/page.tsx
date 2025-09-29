
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

export default function UdmLoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would perform authentication here.
    // For this demo, we'll just redirect to the UDM portal homepage.
    router.push("/udm-portal");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Icons.logo className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline">UDM Portal Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the Unified Digital Management Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Official ID</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="official-id@indianrail.gov.in"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Login
              </Button>
            </div>
          </form>
            <div className="mt-4 text-center text-sm">
                <Link href="/dashboard" className="underline text-primary">
                Back to RailWatch
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
