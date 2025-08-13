import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GamingCard, GamingCardHeader, GamingCardTitle, GamingCardContent } from "@/components/ui/gaming-card";
import { GamingButton } from "@/components/ui/gaming-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTournamentStore } from "@/store/tournament";
import { Trophy, Target, Users, Zap } from "lucide-react";

const Tournament = () => {
  const navigate = useNavigate();
  const { tournament, addMatch } = useTournamentStore();
  
  const [currentMatchData, setCurrentMatchData] = useState<{
    [teamId: string]: { kills: number; placement: number; deductions: number }
  }>({});

  useEffect(() => {
    if (!tournament) {
      navigate("/setup");
      return;
    }
    
    // Initialize current match data
    const initialData: typeof currentMatchData = {};
    tournament.teams.forEach(team => {
      initialData[team.id] = { kills: 0, placement: 1, deductions: 0 };
    });
    setCurrentMatchData(initialData);
  }, [tournament, navigate]);

  const calculatePoints = (teamId: string) => {
    if (!tournament || !currentMatchData[teamId]) {
      return {
        killPoints: 0,
        placementPoints: 0,
        totalPoints: 0,
      };
    }
    
    const teamData = currentMatchData[teamId];
    const killPoints = teamData.kills * tournament.pointsPerKill;
    const placementPoints = tournament.placementPoints[teamData.placement - 1] || 0;
    const totalPoints = killPoints + placementPoints - teamData.deductions;
    
    return {
      killPoints,
      placementPoints,
      totalPoints,
    };
  };

  const handleInputChange = (teamId: string, field: keyof typeof currentMatchData[string], value: number) => {
    setCurrentMatchData(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [field]: value,
      }
    }));
  };

  const handleSubmitMatch = () => {
    if (!tournament) return;
    
    const matchData = {
      matchNumber: tournament.currentMatch,
      teams: Object.keys(currentMatchData).reduce((acc, teamId) => {
        const points = calculatePoints(teamId);
        acc[teamId] = {
          ...currentMatchData[teamId],
          ...points,
        };
        return acc;
      }, {} as any),
    };
    
    addMatch(matchData);
    
    // Reset for next match
    const resetData: typeof currentMatchData = {};
    tournament.teams.forEach(team => {
      resetData[team.id] = { kills: 0, placement: 1, deductions: 0 };
    });
    setCurrentMatchData(resetData);
  };

  const getOverallLeaderboard = () => {
    if (!tournament) return [];
    
    const teamTotals = tournament.teams.map(team => {
      const totalPoints = tournament.matches.reduce((sum, match) => {
        return sum + (match.teams[team.id]?.totalPoints || 0);
      }, 0);
      
      return {
        ...team,
        totalPoints,
        matches: tournament.matches.length,
      };
    });
    
    return teamTotals.sort((a, b) => b.totalPoints - a.totalPoints);
  };

  if (!tournament) {
    return <div>Loading...</div>;
  }

  const leaderboard = getOverallLeaderboard();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-gaming glow-text mb-2">{tournament.name}</h1>
          <p className="text-muted-foreground">
            {tournament.type.toUpperCase()} • Match {tournament.currentMatch} of {tournament.totalMatches}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Match Input */}
          <div className="xl:col-span-2">
            <GamingCard>
              <GamingCardHeader>
                <GamingCardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  Match {tournament.currentMatch} Input
                </GamingCardTitle>
              </GamingCardHeader>
              <GamingCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournament.teams.map((team) => {
                    const points = calculatePoints(team.id);
                    return (
                      <div key={team.id} className="gaming-card p-4 space-y-3">
                        <h3 className="font-gaming font-bold text-center glow-text">{team.name}</h3>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Kills</Label>
                          <Input
                            type="number"
                            min="0"
                            value={currentMatchData[team.id]?.kills || 0}
                            onChange={(e) => handleInputChange(team.id, 'kills', parseInt(e.target.value) || 0)}
                            className="h-8 border-border bg-input"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Placement</Label>
                          <Input
                            type="number"
                            min="1"
                            max={tournament.teams.length}
                            value={currentMatchData[team.id]?.placement || 1}
                            onChange={(e) => handleInputChange(team.id, 'placement', parseInt(e.target.value) || 1)}
                            className="h-8 border-border bg-input"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Deductions</Label>
                          <Input
                            type="number"
                            min="0"
                            value={currentMatchData[team.id]?.deductions || 0}
                            onChange={(e) => handleInputChange(team.id, 'deductions', parseInt(e.target.value) || 0)}
                            className="h-8 border-border bg-input"
                          />
                        </div>
                        
                        <div className="pt-2 border-t border-border text-center">
                          <p className="text-xs text-muted-foreground">Total Points</p>
                          <p className="text-lg font-bold text-primary">{points.totalPoints}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 text-center">
                  <GamingButton
                    variant="glow"
                    size="lg"
                    onClick={handleSubmitMatch}
                    disabled={tournament.currentMatch > tournament.totalMatches}
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Submit Match {tournament.currentMatch}
                  </GamingButton>
                </div>
              </GamingCardContent>
            </GamingCard>
          </div>

          {/* Leaderboard */}
          <div>
            <GamingCard>
              <GamingCardHeader>
                <GamingCardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
                  Overall Leaderboard
                </GamingCardTitle>
              </GamingCardHeader>
              <GamingCardContent>
                <div className="space-y-2">
                  {leaderboard.map((team, index) => (
                    <div
                      key={team.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        index === 0 
                          ? 'bg-gradient-primary glow-border' 
                          : index === 1 
                          ? 'bg-accent-blue/20 border border-accent-blue/30'
                          : index === 2 
                          ? 'bg-accent-red/20 border border-accent-red/30'
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${index < 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
                          #{index + 1}
                        </span>
                        <span className="font-gaming">{team.name}</span>
                      </div>
                      <span className="font-bold text-primary">{team.totalPoints}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Matches Completed</p>
                  <p className="font-bold">{tournament.matches.length} / {tournament.totalMatches}</p>
                </div>
              </GamingCardContent>
            </GamingCard>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-sm">Made by <span className="text-primary font-gaming">PsychoXR</span></p>
        </div>
      </div>
    </div>
  );
};

export default Tournament;