import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GamingCard, GamingCardHeader, GamingCardTitle, GamingCardContent } from "@/components/ui/gaming-card";
import { GamingButton } from "@/components/ui/gaming-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTournamentStore } from "@/store/tournament";
import { Gamepad2, Users, Trophy } from "lucide-react";

const TournamentSetup = () => {
  const navigate = useNavigate();
  const { createTournament } = useTournamentStore();
  
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentType, setTournamentType] = useState<"scrims" | "semis" | "finals" | "grand-finals">("scrims");
  const [totalMatches, setTotalMatches] = useState(5);
  const [teamCount, setTeamCount] = useState(10);
  const [teamNames, setTeamNames] = useState<string[]>([]);

  const handleTeamCountChange = (count: number) => {
    setTeamCount(count);
    const newTeamNames = Array(count).fill("").map((_, i) => teamNames[i] || `Team ${i + 1}`);
    setTeamNames(newTeamNames);
  };

  const handleTeamNameChange = (index: number, name: string) => {
    const updatedNames = [...teamNames];
    updatedNames[index] = name;
    setTeamNames(updatedNames);
  };

  const handleCreateTournament = () => {
    if (!tournamentName.trim() || teamNames.some(name => !name.trim())) {
      return;
    }

    const teams = teamNames.map((name, index) => ({
      id: `team-${index}`,
      name: name.trim(),
    }));

    createTournament({
      name: tournamentName,
      type: tournamentType,
      totalMatches,
      teams,
      pointsPerKill: 1,
      placementPoints: Array(teamCount).fill(0).map((_, i) => teamCount - i),
      deductionPoints: 0,
    });

    navigate("/points-setup");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-gaming glow-text mb-2">Tournament Setup</h1>
          <p className="text-muted-foreground">Configure your esports tournament</p>
        </div>

        <GamingCard className="mb-6">
          <GamingCardHeader>
            <GamingCardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              Tournament Details
            </GamingCardTitle>
          </GamingCardHeader>
          <GamingCardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tournament-name">Tournament Name</Label>
                <Input
                  id="tournament-name"
                  placeholder="Enter tournament name..."
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="border-border bg-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tournament-type">Tournament Type</Label>
                <Select value={tournamentType} onValueChange={(value: any) => setTournamentType(value)}>
                  <SelectTrigger className="border-border bg-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scrims">Scrims</SelectItem>
                    <SelectItem value="semis">Semi Finals</SelectItem>
                    <SelectItem value="finals">Finals</SelectItem>
                    <SelectItem value="grand-finals">Grand Finals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="total-matches">Total Matches</Label>
                <Input
                  id="total-matches"
                  type="number"
                  min="1"
                  max="20"
                  value={totalMatches}
                  onChange={(e) => setTotalMatches(parseInt(e.target.value) || 1)}
                  className="border-border bg-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team-count">Number of Teams</Label>
                <Input
                  id="team-count"
                  type="number"
                  min="2"
                  max="50"
                  value={teamCount}
                  onChange={(e) => handleTeamCountChange(parseInt(e.target.value) || 2)}
                  className="border-border bg-input"
                />
              </div>
            </div>
          </GamingCardContent>
        </GamingCard>

        {teamCount > 0 && (
          <GamingCard>
            <GamingCardHeader>
              <GamingCardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Team Names
              </GamingCardTitle>
            </GamingCardHeader>
            <GamingCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamNames.map((name, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`team-${index}`}>Team {index + 1}</Label>
                    <Input
                      id={`team-${index}`}
                      placeholder={`Team ${index + 1} name...`}
                      value={name}
                      onChange={(e) => handleTeamNameChange(index, e.target.value)}
                      className="border-border bg-input"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <GamingButton
                  variant="glow"
                  size="lg"
                  onClick={handleCreateTournament}
                  disabled={!tournamentName.trim() || teamNames.some(name => !name.trim())}
                  className="flex items-center gap-2"
                >
                  <Gamepad2 className="h-5 w-5" />
                  Continue to Points Setup
                </GamingButton>
              </div>
            </GamingCardContent>
          </GamingCard>
        )}
      </div>
    </div>
  );
};

export default TournamentSetup;