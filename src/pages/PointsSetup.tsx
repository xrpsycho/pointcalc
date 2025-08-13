import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GamingCard, GamingCardHeader, GamingCardTitle, GamingCardContent } from "@/components/ui/gaming-card";
import { GamingButton } from "@/components/ui/gaming-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTournamentStore } from "@/store/tournament";
import { Calculator, Target, AlertTriangle } from "lucide-react";

const PointsSetup = () => {
  const navigate = useNavigate();
  const { tournament, updateTournament } = useTournamentStore();
  
  const [pointsPerKill, setPointsPerKill] = useState(1);
  const [placementPoints, setPlacementPoints] = useState<number[]>([]);
  const [deductionPoints, setDeductionPoints] = useState(0);

  useEffect(() => {
    if (!tournament) {
      navigate("/setup");
      return;
    }
    
    // Initialize placement points (1st place gets highest points)
    const initialPlacementPoints = Array(tournament.teams.length)
      .fill(0)
      .map((_, i) => tournament.teams.length - i);
    setPlacementPoints(initialPlacementPoints);
  }, [tournament, navigate]);

  const handlePlacementPointChange = (position: number, points: number) => {
    const updated = [...placementPoints];
    updated[position] = points;
    setPlacementPoints(updated);
  };

  const handleContinue = () => {
    if (!tournament) return;
    
    updateTournament({
      pointsPerKill,
      placementPoints,
      deductionPoints,
    });
    
    navigate("/tournament");
  };

  if (!tournament) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-gaming glow-text mb-2">Points Configuration</h1>
          <p className="text-muted-foreground">Set up scoring rules for {tournament.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GamingCard>
            <GamingCardHeader>
              <GamingCardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                Kill & Deduction Points
              </GamingCardTitle>
            </GamingCardHeader>
            <GamingCardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="points-per-kill">Points per Kill</Label>
                <Input
                  id="points-per-kill"
                  type="number"
                  min="0"
                  step="0.1"
                  value={pointsPerKill}
                  onChange={(e) => setPointsPerKill(parseFloat(e.target.value) || 0)}
                  className="border-border bg-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deduction-points">Deduction Points (for misbehavior)</Label>
                <Input
                  id="deduction-points"
                  type="number"
                  min="0"
                  step="0.1"
                  value={deductionPoints}
                  onChange={(e) => setDeductionPoints(parseFloat(e.target.value) || 0)}
                  className="border-border bg-input"
                />
                <p className="text-xs text-muted-foreground">
                  Points to deduct for rule violations
                </p>
              </div>
            </GamingCardContent>
          </GamingCard>

          <GamingCard>
            <GamingCardHeader>
              <GamingCardTitle className="flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Placement Points
              </GamingCardTitle>
            </GamingCardHeader>
            <GamingCardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {placementPoints.map((points, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Label className="w-16 text-sm">#{index + 1}</Label>
                    <Input
                      type="number"
                      min="0"
                      value={points}
                      onChange={(e) => handlePlacementPointChange(index, parseInt(e.target.value) || 0)}
                      className="border-border bg-input flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-12">pts</span>
                  </div>
                ))}
              </div>
            </GamingCardContent>
          </GamingCard>
        </div>

        <div className="mt-8 text-center">
          <GamingButton
            variant="glow"
            size="lg"
            onClick={handleContinue}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-5 w-5" />
            Start Tournament
          </GamingButton>
        </div>
      </div>
    </div>
  );
};

export default PointsSetup;