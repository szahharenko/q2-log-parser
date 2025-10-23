import { killPatterns, suicidePatterns } from "./patterns";
import { AllPlayerStats, HeadHunterAchievement, Achievement } from "../types/types";

export const calculateHeadHunter = (stats: AllPlayerStats): HeadHunterAchievement | null => {
    const players = Object.keys(stats);
    if (players.length < 2) return null; // Not enough players for an achievement

    // 1. Find the leader(s) by finding the max kill count
    let maxKills = 0;
    for (const playerName in stats) {
      if (stats[playerName].kills > maxKills) {
        maxKills = stats[playerName].kills;
      }
    }

    // If no one has kills, no leader, so no achievement
    if (maxKills === 0) return null;

    // Get an array of all players who are tied for the lead
    const leaders = players.filter(p => stats[p].kills === maxKills);

    // 2. Find who killed the leader(s) the most
    let bestHunter = { name: '', kills: 0 };

    for (const playerName in stats) {
      // A player cannot be a head hunter for killing themselves
      if (leaders.includes(playerName)) continue;

      let killsOnLeaders = 0;
      // Sum up this player's kills on all leaders
      for (const leader of leaders) {
        killsOnLeaders += stats[playerName].killBreakdown[leader] || 0;
      }

      if (killsOnLeaders > bestHunter.kills) {
        bestHunter = { name: playerName, kills: killsOnLeaders };
      }
    }

    // 3. Return the achievement object if a hunter was found
    if (bestHunter.kills > 0) {
      return {
        hunter: bestHunter.name,
        killsOnLeader: bestHunter.kills,
        leader: leaders.join(', '), // Handles ties gracefully
      };
    }

    return null;
  };

export const calculateNoMercyForMinions = (stats: AllPlayerStats): HeadHunterAchievement | null => {
    const players = Object.keys(stats);
    if (players.length < 2) return null; // Not enough players for an achievement
    // 1. Find the player(s) with the most deaths
    let maxDeaths = 0;
    for (const playerName in stats) {
      if (stats[playerName].deaths > maxDeaths) {
        maxDeaths = stats[playerName].deaths;
      }
    }
    // If no one has deaths, no achievement
    if (maxDeaths === 0) return null;
    // Get an array of all players who are tied for most deaths
    const mostDeceased = players.filter(p => stats[p].deaths === maxDeaths);
    // 2. Find who killed the most-deceased player(s) the most
    let bestBully = { name: '', kills: 0 };
    for (const playerName in stats) {
      // A player cannot be a bully for killing themselves
      if (mostDeceased.includes(playerName)) continue;
      let killsOnDeceased = 0;
      // Sum up this player's kills on all most-deceased players
      for (const deceased of mostDeceased) {
        killsOnDeceased += stats[playerName].killBreakdown[deceased] || 0;
      }
      if (killsOnDeceased > bestBully.kills) {
        bestBully = { name: playerName, kills: killsOnDeceased };
      }
    }
    // 3. Return the achievement object if a bully was found
    if (bestBully.kills > 0) {
      return {
        hunter: bestBully.name,
        killsOnLeader: bestBully.kills,
        leader: mostDeceased.join(', '), // Handles ties gracefully
      };
    }
    return null;
}

  export const calculateMostTelefrags = (stats: AllPlayerStats): Achievement | null => {
    let maxTelefrags = 0;
    for (const playerName in stats) {
      if (stats[playerName].telefrags > maxTelefrags) {
        maxTelefrags = stats[playerName].telefrags;
      }
    }

    // If no one got a telefrag, no award
    if (maxTelefrags === 0) {
      return null;
    }

    const achievers = Object.keys(stats).filter(
      p => stats[p].telefrags === maxTelefrags
    );

    return { achievers, count: maxTelefrags };
  };

  export  const calculateWrongTurn = (stats: AllPlayerStats): Achievement | null => {
    let maxSuicides = 0;
    for (const playerName in stats) {
        if (stats[playerName].suicides > maxSuicides) {
            maxSuicides = stats[playerName].suicides;
        }
    }

    if (maxSuicides === 0) return null;

    const achievers = Object.keys(stats).filter(p => stats[p].suicides === maxSuicides);
    return { achievers, count: maxSuicides };
  };

  export const calculateMostGrenadeKills = (stats: AllPlayerStats): Achievement | null => {
    let maxGrenadeKills = 0;
    for (const playerName in stats) {
        if (stats[playerName].grenadeKills > maxGrenadeKills) {
            maxGrenadeKills = stats[playerName].grenadeKills;
        }
    }

    if (maxGrenadeKills === 0) return null;

    const achievers = Object.keys(stats).filter(p => stats[p].grenadeKills === maxGrenadeKills);
    return { achievers, count: maxGrenadeKills };
  };

  export const calculateMostBlasterKills = (stats: AllPlayerStats): Achievement | null => {
    let maxBlasterKills = 0;
    for (const playerName in stats) {
        if (stats[playerName].blasterKills > maxBlasterKills) {
            maxBlasterKills = stats[playerName].blasterKills;
        }
    }

    if (maxBlasterKills === 0) return null;

    const achievers = Object.keys(stats).filter(p => stats[p].blasterKills === maxBlasterKills);
    return { achievers, count: maxBlasterKills };
  }

  export const calculateMostEventStreak = (stats: AllPlayerStats): Achievement | null => {
    let maxEventStreak = 0;
    for (const playerName in stats) {
        if (stats[playerName].eventStreak > maxEventStreak) {
            maxEventStreak = stats[playerName].eventStreak;
        }
    }

    if (maxEventStreak === 0) return null;

    const achievers = Object.keys(stats).filter(p => stats[p].eventStreak === maxEventStreak);
    return { achievers, count: maxEventStreak };
  };

  export const calculateSpecialist = (leastUsedWeapon: string | null, playerStats: AllPlayerStats) => {
    if (!leastUsedWeapon) return null;
    let topPlayer = '';
    let topKills = 0;
    for (const [player, stats] of Object.entries(playerStats)) {
        const killsWithWeapon = stats.weaponKillsBreakdown[leastUsedWeapon] || 0;
        if (killsWithWeapon > topKills) {
            topKills = killsWithWeapon;
            topPlayer = player;
        }
    }
    return topPlayer ? { player: topPlayer, weapon: leastUsedWeapon, kills: topKills } : null;
  }

  export const getLeastUsedWeapon = (weaponStats: Record<string, number> | null ) => {
    if (!weaponStats) return null;
    const entries = Object.entries(weaponStats).filter(([, count]) => count > 0);
    if (entries.length === 0) return null;
    entries.sort((a, b) => a[1] - b[1]);
    return { weapon: entries[0][0], count: entries[0][1] };
}

export const filterGameLines = (lines: string[]): string[] => {
  return lines.filter(line => {
    // Check if line matches any kill pattern
    for (const pattern of killPatterns) {
        if (pattern.test(line)) {
            return true;
        }
    }
    // Check if line matches any
    for (const pattern of suicidePatterns) {
        if (pattern.test(line)) {
            return true;
        }
    }
    return false;
  });
};

export type Weapon = 'Railgun' | 'Rocket Launcher' | 'Machinegun' | 'Chaingun' | 'Super Shotgun' | 'Hyperblaster' | 'BFG' | 'Grenade' | 'Telefrag' | 'Shotgun' | 'Blaster';

const getWeaponName = (pattern: string): Weapon | null => {
    if(pattern.includes("railed")) return 'Railgun';
    if(pattern.includes("rocket")) return 'Rocket Launcher';
    if(pattern.includes("machinegunned")) return 'Machinegun';
    if(pattern.includes("chaingun")) return 'Chaingun';
    if(pattern.includes("super shotgun")) return 'Super Shotgun';
    if(pattern.includes("hyperblaster")) return 'Hyperblaster';
    if(pattern.includes("BFG")) return 'BFG';
    if(pattern.includes("grenade")) return 'Grenade';
    if(pattern.includes("shrapnel")) return 'Grenade';
    if(pattern.includes("grenade")) return 'Grenade';
    if(pattern.includes("invade")) return 'Telefrag';
    if(pattern.includes("pain")) return 'Telefrag';
    if(pattern.includes("gunned down by")) return 'Shotgun';
    if(pattern.includes("blasted by")) return 'Blaster';

    return null;
}

export const parseGameEvents = (lines: string[]): { stats: AllPlayerStats, weaponStats: { [K in Weapon]: number}} => {
    const stats: AllPlayerStats = {};
    const weaponStats: { [K in Weapon]: number} = {
      'Railgun': 0,
      'Rocket Launcher': 0,
      'Machinegun': 0,
      'Chaingun': 0,
      'Super Shotgun': 0,
      'Hyperblaster': 0,
      'BFG': 0,
      'Grenade': 0,
      'Telefrag': 0,
      'Shotgun': 0,
      'Blaster': 0
    }
    const ensurePlayer = (name: string) => {
      if (!stats[name]) {
        stats[name] = { kills: 0, deaths: 0, suicides: 0,  telefrags: 0, eventStreak: 0, killBreakdown: {}, grenadeKills: 0, headHunter: 0, looseHunter: 0, weaponKillsBreakdown: {}, blasterKills: 0};
      }
    };
    let currentStreakPlayer: string | null = null;
    let currentStreakCount =

    0;

    lines.forEach(line => {
      let eventFound = false;

      // 1. Check for kill events first
      for (const pattern of killPatterns) {
          const match = line.match(pattern);
          if (match) {
              const victim = match[1].trim();
              const killer = match[2].trim();

              ensurePlayer(victim);
              ensurePlayer(killer);

              if (currentStreakPlayer === killer) {
                  currentStreakCount += 1;
              } else {
                  currentStreakPlayer = killer;
                  currentStreakCount = 1;
              }

              stats[killer].eventStreak = Math.max(stats[killer].eventStreak, currentStreakCount);
              stats[killer].kills += 1;
              stats[victim].deaths += 1;
              stats[killer].killBreakdown[victim] = (stats[killer].killBreakdown[victim] || 0) + 1;
              stats[killer].weaponKillsBreakdown = stats[killer].weaponKillsBreakdown || {};

              const patternSource = pattern.source;
              const weapon = getWeaponName(patternSource);
              if (weapon) {
                  weaponStats[weapon] += 1;
              }
              if (weapon) {
                  stats[killer].weaponKillsBreakdown[weapon] = (stats[killer].weaponKillsBreakdown[weapon] || 0) + 1;
              }

              if (weapon === 'Telefrag') {
                  stats[killer].telefrags += 1;
              }
              if (weapon === 'Grenade') {
                  stats[killer].grenadeKills += 1;
              }
              if (weapon === 'Blaster') {
                stats[killer].blasterKills += 1;
            }
              eventFound = true;
              break;
          }
      }

      // 2. If it wasn't a kill, check for a suicide
      if (!eventFound) {
          for (const pattern of suicidePatterns) {
              const match = line.match(pattern);
              if (match) {
                  const player = match[1].trim();
                  ensurePlayer(player);
                  if (currentStreakPlayer === player) {
                      currentStreakCount += 1;
                  } else {
                      currentStreakPlayer = player;
                      currentStreakCount = 1;
                  }
                  stats[player].eventStreak = Math.max(stats[player].eventStreak, currentStreakCount);
                  stats[player].suicides += 1;
                  stats[player].deaths += 1; // A suicide still counts as a death
                  break;
              }
          }
      }
    });
    return {
      stats,
      weaponStats
    };
  };
