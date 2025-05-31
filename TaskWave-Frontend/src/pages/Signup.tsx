
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const [company_name, setCompanyName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // --- Prepare Payload ---
      // Note: Backend needs modification for company_name
      const payload = {
        company_name: company_name, // Include if backend is updated
        username: username,          // Map username to name
        email: email,
        password: password,
        password_confirmation: confirmPassword, // Include confirmation
      };

      // --- Call register function from AuthContext ---
      const success = await register(payload);

      if (success) {
        toast({
          title: "Account created successfully!",
          description: "Please log in to continue.", // Updated description
        });

        // Redirect to login page after successful registration
        navigate("/login?registered=true"); // Added query param as example indicator
      } else {
        // The register function in authService/AuthContext returned false
        // This often means a 4xx error occurred (like validation 422)
        toast({
          title: "Registration failed",
          // TODO: Improve this message. Check console for detailed errors from authService.
          // Ideally, parse validation errors if returned by the backend.
          description: "Please check the details you provided and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
       // Catch unexpected errors during the register call itself
       console.error("Registration handleSubmit error:", error) // Log the actual error
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }



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
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create your TaskWave account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  type="text"
                  placeholder="Company Name"
                  value={company_name}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">UserName</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="UserName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Signup;
