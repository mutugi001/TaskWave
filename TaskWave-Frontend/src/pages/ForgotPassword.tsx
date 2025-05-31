import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import Cookies from 'js-cookie';
import apiClient from '../api/axiosConfig'; // Use the interceptor-enhanced client



const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const xsrfToken = Cookies.get('XSRF-TOKEN');
      const response = await apiClient.post(
        '/api/forgot-password', // <-- Use this endpoint for requesting reset link
        { email },
        {
          headers: { 'X-XSRF-TOKEN': xsrfToken || '' },
        }
      );
      console.log("Reset password response:", response);

      const data = response.data;
      // Check if the response is successful

      if (response.status === 200) {
        setIsSubmitted(true);
        toast({
          title: "Reset email sent",
          description: "If an account exists with this email, you'll receive reset instructions.",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send reset instructions.",
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
      {/* Header with logo and theme toggle */}
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

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center pt-16 px-4">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              {isSubmitted
                ? "Check your email for reset instructions"
                : "Enter your email to receive password reset instructions"}
            </CardDescription>
          </CardHeader>
          {!isSubmitted ? (
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
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </Button>
              </form>
            </CardContent>
          ) : (
            <CardContent className="text-center py-6">
              <p className="mb-4">We've sent password reset instructions to:</p>
              <p className="font-medium text-primary">{email}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Please check your inbox and spam folder.
              </p>
            </CardContent>
          )}
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

export default ForgotPassword;
