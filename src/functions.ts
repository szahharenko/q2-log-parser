import { killPatterns, suicidePatterns } from "./patterns";
import { AllPlayerStats, EventStreakAchievement, GrenadeAchievement, HeadHunterAchievement, TelefragAchievement, WrongTurnAchievement } from "./types";

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

  export const calculateMostTelefrags = (stats: AllPlayerStats): TelefragAchievement | null => {
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

  export  const calculateWrongTurn = (stats: AllPlayerStats): WrongTurnAchievement | null => {
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

  export const calculateMostGrenadeKills = (stats: AllPlayerStats): GrenadeAchievement | null => {
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

  export const calculateMostEventStreak = (stats: AllPlayerStats): EventStreakAchievement | null => {
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


export const parseGameEvents = (lines: string[]): AllPlayerStats => {
    const stats: AllPlayerStats = {};
    const ensurePlayer = (name: string) => {
      if (!stats[name]) {
        stats[name] = { kills: 0, deaths: 0, suicides: 0,  telefrags: 0, eventStreak: 0, killBreakdown: {}, grenadeKills: 0, headHunter: 0};
      }
    };
    let currentStreakPlayer: string | null = null;
    let currentStreakCount = 0;

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

              const patternSource = pattern.source;
              if (patternSource.includes("invade")) {
                  stats[killer].telefrags += 1;
              } else if (patternSource.includes("grenade") || patternSource.includes("shrapnel")) {
                  stats[killer].grenadeKills += 1;
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
    console.log({stats})
    return stats;
  };
