import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GamingCard, GamingCardHeader, GamingCardTitle, GamingCardContent } from "@/components/ui/gaming-card";
import { GamingButton } from "@/components/ui/gaming-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const validCredentials = [
      { id: "pym1t", password: "havocxr" },
      { id: "test", password: "password" },
      { id: "admin", password: "admin" }
    ];

    const isValidUser = validCredentials.some(
      cred => cred.id === id && cred.password === password
    );

    if (isValidUser) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userId", id);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to PointCalc.",
      });
      navigate("/");
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-neon opacity-5"></div>
      
      <div className="relative w-full max-w-md">
        <GamingCard>
          <GamingCardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <GamingCardTitle>Access Terminal</GamingCardTitle>
            <p className="text-muted-foreground">Enter your credentials to continue</p>
          </GamingCardHeader>
          
          <GamingCardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="id" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User ID
                </Label>
                <Input
                  id="id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="gaming-input"
                  placeholder="Enter your ID"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="gaming-input"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <GamingButton
                type="submit"
                variant="glow"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Granted"}
              </GamingButton>
            </form>
          </GamingCardContent>
        </GamingCard>
        
        <footer className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Made by <span className="text-primary font-gaming glow-text">PsychoXR</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;