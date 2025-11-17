import { Weapon } from "../utils/functions";

export interface KillBreakdown {
    [victimName: string]: number;
  }
export type WeaponKillsBreakdown = {
    [weaponName in Weapon]: number;
};

type AchievementName =  'quadManiac' | 'headHunter' | 'respawnHero'  | 'respawnHeroName' | 'wrongTurn' | 'grenadier' | 'troublemaker' | 'zeroTolerance' | 'optimist' | 'boomstickBaron' | 'chatLord';

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
    dominator: boolean;
    willPower: boolean;
    groupLeader?: string;
    specialistWeapon?: string;
    specialistWeaponKills?: number;
    weakestPlayer?: string;
    customAchievements?: {
        [K in AchievementName]?: number;
    };
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
