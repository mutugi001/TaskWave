import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import Cookies from 'js-cookie';
import apiClient from '../api/axiosConfig';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const xsrfToken = Cookies.get('XSRF-TOKEN');
      const response = await apiClient.post(
        '/api/reset-password',
        {
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
        {
          headers: { 'X-XSRF-TOKEN': xsrfToken || '' },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Password reset successful",
          description: "You can now log in with your new password.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: response.data.error || "Failed to reset password.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b z-50 px-4">
        <div className="flex items-center justify-between h-full w-full mx-auto max-w-screen-2xl">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="h-8 w-1 bg-blue-600 rounded-full animate-pulse" />
              <div className="h-8 w-1 bg-purple-600 rounded-full animate-pulse [animation-delay:200ms]" />
              <div className="h-8 w-1 bg-green-600 rounded-full animate-pulse [animation-delay:400ms]" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 animate-pulse">
              TaskWave
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center pt-16 px-4">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email and new password below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  placeholder="Confirm password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default ResetPassword;
