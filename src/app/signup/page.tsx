
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function SignUpPage() {
  const { user, signUpWithEmail } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);


  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (password.length > 7) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    return strength;
  }, [password]);

  const passwordsMatch = useMemo(() => {
    if (!password && !confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const canSubmit = agreed && passwordsMatch && passwordStrength >= 50 && fullName && email && role;

  const handleSignUp = async () => {
    if (!canSubmit) return;
    try {
      await signUpWithEmail(email, password, fullName);
      setAccountCreated(true);
      toast({
        title: "Account Created!",
        description: "Redirecting you to the dashboard...",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred.",
      });
      console.error("Error signing up", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
             <div className="bg-gray-100 p-3 rounded-full">
                <Icons.logo className="w-8 h-8 text-gray-400" />
             </div>
          </div>
          <CardTitle className="text-3xl font-headline">Create Your Account</CardTitle>
          <CardDescription>
            Join Rails n Tales to manage your inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Inspector ID</Label>
                <Input id="email" type="email" placeholder="inspector-id@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="mobile-number">Mobile Number (Optional)</Label>
                <Input id="mobile-number" placeholder="+1 234 567 890" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={setRole} value={role}>
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="inspector">Inspector</SelectItem>
                        <SelectItem value="engineer">Engineer</SelectItem>
                        <SelectItem value="dispatcher">Dispatcher</SelectItem>
                        <SelectItem value="mechanic">Mechanic</SelectItem>
                        <SelectItem value="maintainer">Maintainer</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Progress value={passwordStrength} className="w-24 h-1.5" />
                    <span>Strength: {passwordStrength}%</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                 {!passwordsMatch && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                 )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 my-6">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the <Link href="#" className="underline text-primary">Terms & Conditions</Link>
                </Label>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-bold" disabled={!canSubmit}>
                <Sparkles className="mr-2 h-5 w-5" />
                Create Account
            </Button>
            
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary font-semibold">
              Log in
            </Link>
          </div>

          {accountCreated && (
             <Alert className="mt-6 bg-green-500 text-white border-green-500">
                <AlertDescription className="text-center font-semibold">
                    Account created successfully. Redirecting...
                </AlertDescription>
             </Alert>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
