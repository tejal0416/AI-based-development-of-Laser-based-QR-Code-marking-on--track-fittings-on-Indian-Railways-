"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
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

export default function SignUpPage() {
  const { signInWithEmail } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState("Jane Inspector");
  const [email, setEmail] = useState("jane@railwatch.com");
  const [mobile, setMobile] = useState("+1 555 0102");
  const [role, setRole] = useState("Inspector");
  const [password, setPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const [agreed, setAgreed] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

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

  const canSubmit = agreed && passwordsMatch && passwordStrength >= 50;

  const handleSignUp = async () => {
    if (!canSubmit) return;
    try {
      await signInWithEmail(email, password);
      setAccountCreated(true);
      setTimeout(() => {
        router.push("/login");
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
          <CardTitle className="text-3xl font-headline">Rails n Tales</CardTitle>
          <CardDescription>
            Create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number (optional)</Label>
                <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Progress value={passwordStrength} className="w-24 h-1.5" />
                    <span>Strength</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                 {!passwordsMatch && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                 )}
                 {passwordsMatch && confirmPassword && (
                     <p className="text-xs text-green-600">Passwords match</p>
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
              Back to Log in
            </Link>
          </div>

          {accountCreated && (
             <Alert className="mt-6 bg-green-500 text-white border-green-500">
                <AlertDescription className="text-center font-semibold">
                    Account created successfully. Redirecting to login...
                </AlertDescription>
             </Alert>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
