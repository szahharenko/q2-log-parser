
export interface KillBreakdown {
    [victimName: string]: number;
  }
export interface WeaponKillsBreakdown {
    [weaponName: string]: number
};
export interface PlayerStats {
    kills: number;
    deaths: number;
    suicides: number;
    killBreakdown: KillBreakdown;
    weaponKillsBreakdown: WeaponKillsBreakdown
    grenadeKills: number;
    telefrags: number;
    kdr?: number;
    eventStreak: number;
    headHunter: number;
    looseHunter: number;
    blasterKills: number;
    chats: string[];
    chatCount: number;
    quadsPicked: number;
    bestFrag: boolean;
    wft: boolean;
}

export type AllPlayerStats = {
    [playerName: string]: PlayerStats;
};

export interface HeadHunterAchievement {
    hunter: string;
    killsOnLeader: number;
    leader: string;
}

export interface Achievement {
    achievers: string[];
    count: number;
}
