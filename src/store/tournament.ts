import { create } from 'zustand';

export interface Team {
  id: string;
  name: string;
  logo?: string;
}

export interface Match {
  id: string;
  matchNumber: number;
  teams: {
    [teamId: string]: {
      kills: number;
      placement: number;
      killPoints: number;
      placementPoints: number;
      deductions: number;
      totalPoints: number;
    };
  };
}

export interface Tournament {
  id: string;
  name: string;
  type: 'scrims' | 'semis' | 'finals' | 'grand-finals';
  totalMatches: number;
  teams: Team[];
  pointsPerKill: number;
  placementPoints: number[];
  deductionPoints: number;
  matches: Match[];
  currentMatch: number;
}

interface TournamentStore {
  tournament: Tournament | null;
  createTournament: (tournament: Omit<Tournament, 'id' | 'matches' | 'currentMatch'>) => void;
  updateTournament: (updates: Partial<Tournament>) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (matchId: string, updates: Partial<Match>) => void;
  resetTournament: () => void;
}

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  tournament: null,
  
  createTournament: (tournamentData) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: Date.now().toString(),
      matches: [],
      currentMatch: 1,
    };
    set({ tournament: newTournament });
  },
  
  updateTournament: (updates) => {
    const { tournament } = get();
    if (tournament) {
      set({ tournament: { ...tournament, ...updates } });
    }
  },
  
  addMatch: (matchData) => {
    const { tournament } = get();
    if (tournament) {
      const newMatch: Match = {
        ...matchData,
        id: Date.now().toString(),
      };
      const updatedMatches = [...tournament.matches, newMatch];
      set({
        tournament: {
          ...tournament,
          matches: updatedMatches,
          currentMatch: tournament.currentMatch + 1,
        },
      });
    }
  },
  
  updateMatch: (matchId, updates) => {
    const { tournament } = get();
    if (tournament) {
      const updatedMatches = tournament.matches.map((match) =>
        match.id === matchId ? { ...match, ...updates } : match
      );
      set({
        tournament: {
          ...tournament,
          matches: updatedMatches,
        },
      });
    }
  },
  
  resetTournament: () => {
    set({ tournament: null });
  },
}));