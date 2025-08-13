import { useNavigate } from "react-router-dom";
import { GamingCard, GamingCardHeader, GamingCardTitle, GamingCardContent } from "@/components/ui/gaming-card";
import { GamingButton } from "@/components/ui/gaming-button";
import { Gamepad2, Trophy, Zap, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-neon opacity-10"></div>
        <div className="relative px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold font-gaming glow-text mb-6">
              POINTCALC
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-display">
              Professional Esports Tournament Points Calculator
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Create tournaments, set scoring rules, track matches, and generate stunning leaderboards for your esports competitions.
            </p>
            
            <GamingButton
              variant="glow"
              size="xl"
              onClick={() => navigate("/setup")}
              className="flex items-center gap-3 mx-auto"
            >
              <Trophy className="h-6 w-6" />
              Create New Tournament
            </GamingButton>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-gaming text-center glow-text mb-12">
            Tournament Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GamingCard className="text-center">
              <GamingCardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <Gamepad2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <GamingCardTitle>Easy Setup</GamingCardTitle>
              </GamingCardHeader>
              <GamingCardContent>
                <p className="text-muted-foreground">
                  Quick tournament configuration with customizable team names, match counts, and scoring rules.
                </p>
              </GamingCardContent>
            </GamingCard>

            <GamingCard className="text-center">
              <GamingCardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </div>
                <GamingCardTitle>Live Scoring</GamingCardTitle>
              </GamingCardHeader>
              <GamingCardContent>
                <p className="text-muted-foreground">
                  Real-time points calculation with instant leaderboard updates as you input match data.
                </p>
              </GamingCardContent>
            </GamingCard>

            <GamingCard className="text-center">
              <GamingCardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <GamingCardTitle>Pro Design</GamingCardTitle>
              </GamingCardHeader>
              <GamingCardContent>
                <p className="text-muted-foreground">
                  Esports-themed interface with neon styling perfect for streaming and tournament broadcasts.
                </p>
              </GamingCardContent>
            </GamingCard>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border">
        <p className="text-muted-foreground">
          Made by <span className="text-primary font-gaming glow-text">PsychoXR</span>
        </p>
      </footer>
    </div>
  );
};

export default Index;
