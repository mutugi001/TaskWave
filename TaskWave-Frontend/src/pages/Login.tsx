import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// Assuming useToast hook is correctly imported, e.g.:
import { useToast } from "@/components/ui/use-toast"; // Adjust path if necessary
import { ThemeToggle } from "@/components/ThemeToggle";
// Assuming useAuth hook is correctly imported, e.g.:
import { useAuth } from "@/contexts/AuthContext"; // Adjust path if necessary


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // --- Prepare Payload ---
      // This correctly uses the email and password state variables
      const payload = {
        email: email,
        password: password,
      };

      // Use the login function from AuthContext
      const success = await login(payload);
      console.log("Login function returned:", success); // Keep or remove debug log

      if (success) {
         // Adjust the path as necessary
        toast({
          title: "Login successful",
          description: "Welcome back to TaskWave!",
        });

        navigate("/");

      } else {
        // Login function returned false (likely 422 validation error previously, or other 4xx/5xx)
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.", // Consider showing specific errors if available
          variant: "destructive",
        });
      }
    } catch (error) {
      // Catch unexpected errors during the login call itself
      console.error("Login handleSubmit error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }; // <-- Closing brace for handleLogin was here, moved after return

  // --- JSX Structure ---
  // The return statement MUST be inside the Login function component
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
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
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Make sure the onSubmit is on the form tag */}
            <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* Ensure Link component is imported correctly */}
                  <Link
                    to="/forgot-password" // Make sure this route exists if needed
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              {/* Ensure Link component is imported correctly */}
              <Link
                to="/signup" // Make sure this route exists
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}; // <-- Closing brace for Login component goes here

export default Login;
