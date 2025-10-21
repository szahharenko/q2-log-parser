
// Type definitions (unchanged from previous version)
export interface KillBreakdown {
    [victimName: string]: number;
  }
export interface PlayerStats {
    kills: number;
    deaths: number;
    suicides: number;
    killBreakdown: KillBreakdown;
    grenadeKills: number;
    telefrags: number;
    kdr?: number;
    eventStreak: number;
    headHunter: number;
    looseHunter: number;
}
export type AllPlayerStats = {
    [playerName: string]: PlayerStats;
};

export interface HeadHunterAchievement {
    hunter: string;
    killsOnLeader: number;
    leader: string; // Can be a single name or comma-separated for ties
}

export interface TelefragAchievement {
    achievers: string[]; // Array to handle ties
    count: number;
}

export interface WrongTurnAchievement {
    achievers: string[];
    count: number;
}

export interface GrenadeAchievement {
    achievers: string[];
    count: number;
}
export interface EventStreakAchievement {
    achievers: string[];
    count: number;
}