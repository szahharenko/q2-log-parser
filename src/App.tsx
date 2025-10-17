import React, { useState } from 'react';

// Type definitions (unchanged from previous version)
interface KillBreakdown {
  [victimName: string]: number;
}
interface PlayerStats {
  kills: number;
  deaths: number;
  suicides: number;
  killBreakdown: KillBreakdown;
  telefrags: number;
}
type AllPlayerStats = {
  [playerName: string]: PlayerStats;
};

interface HeadHunterAchievement {
  hunter: string;
  killsOnLeader: number;
  leader: string; // Can be a single name or comma-separated for ties
}

interface TelefragAchievement {
  achievers: string[]; // Array to handle ties
  count: number;
}

interface WrongTurnAchievement {
  achievers: string[];
  count: number;
}


const LogParser: React.FC = () => {
  const [logContent, setLogContent] = useState<string>('');
  const [message, setMessage] = useState<string>('Please select a log file to view its content.');
  const [playerStats, setPlayerStats] = useState<AllPlayerStats>({});
  const [headHunter, setHeadHunter] = useState<HeadHunterAchievement | null>(null);
  const [mostTelefrags, setMostTelefrags] = useState<TelefragAchievement | null>(null);
  const [wrongTurn, setWrongTurn] = useState<WrongTurnAchievement | null>(null);


  console.log({logContent})
  // This function remains the same
  const parseGameEvents = (lines: string[]): AllPlayerStats => {
    const stats: AllPlayerStats = {};
    const ensurePlayer = (name: string) => {
      if (!stats[name]) {
        stats[name] = { kills: 0, deaths: 0, suicides: 0,  telefrags: 0, killBreakdown: {} };
      }
    };
    const killPatterns = [
      /(.+) was railed by (.+)/,
      /(.+) ate (.+?)'s rocket/,
      /(.+) was machinegunned by (.+)/,
      /(.+) was cut in half by (.+?)'s chaingun/,
      /(.+) almost dodged (.+?)'s rocket/,
      /(.+) was blown away by (.+?)'s super shotgun/,
      /(.+) was melted by (.+?)'s hyperblaster/,
      /(.+) saw the pretty lights from (.+?)'s BFG/,
      /(.+) was disintegrated by (.+?)'s BFG blast/,
      /(.+) was blasted by (.+)/,
      /(.+) was gunned down by (.+)/,
      /(.+) was popped by (.+?)'s grenade/,
      /(.+) was shredded by (.+?)'s shrapnel/,
      /(.+) caught (.+?)'s handgrenade/,
      /(.+) didn't see (.+?)'s handgrenade/,
      /(.+) feels (.+?)'s pain/,
      /(.+) tried to invade (.+?)'s personal space/,
      /(.+) couldn't hide from (.+?)'s BFG/
    ];
    const suicidePatterns = [
      /(.+) does a back flip into the lava/,
      // Add acid suicide messages here, e.g., /(.+) cratered/
    ];
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

              stats[killer].kills += 1;
              stats[victim].deaths += 1;
              stats[killer].killBreakdown[victim] = (stats[killer].killBreakdown[victim] || 0) + 1;

              if (pattern.source.includes("invade")) {
                  stats[killer].telefrags += 1;
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
                  stats[player].suicides += 1;
                  stats[player].deaths += 1; // A suicide still counts as a death
                  break;
              }
          }
      }
    });
    return stats;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogContent('');
    setMessage('');
    setPlayerStats({});
    setHeadHunter(null); // Reset achievement
    setWrongTurn(null);

    const file = event.target.files?.[0];
    if (!file) { setMessage('No file selected.'); return; }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const fullContent = e.target?.result as string;
      if (!fullContent) { setMessage('Error: Could not read file content.'); return; }

      const initialLines = fullContent.split('\n');

      // --- KEY CHANGE IS HERE ---
      // Create a regex to find timestamps like [YYYY-MM-DD HH:MM] at the start of a line
      const timestampRegex = /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}\] /;
      // Use map() to create a new array with the timestamps removed from each line
      const allLines = initialLines.map(line => line.replace(timestampRegex, ''));
      // --- END OF CHANGE ---

      //const startIndex = allLines.findIndex(line => line.includes('Match has started!'));

      //if (startIndex !== -1) {
        const relevantLines = allLines; //.slice(startIndex + 1);

        // We now pass the CLEANED lines to the display and the parser
        setLogContent(relevantLines.join('\n'));
        const calculatedStats = parseGameEvents(relevantLines);
        setPlayerStats(calculatedStats);
        setMessage(`Successfully parsed the log.`);

        // Achievements
        setHeadHunter(calculateHeadHunter(calculatedStats));
        setMostTelefrags(calculateMostTelefrags(calculatedStats));
        setWrongTurn(calculateWrongTurn(calculatedStats));

    };
    reader.onerror = () => { setMessage('An error occurred while reading the file.'); };
    reader.readAsText(file);
  };

  const calculateHeadHunter = (stats: AllPlayerStats): HeadHunterAchievement | null => {
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

  const calculateMostTelefrags = (stats: AllPlayerStats): TelefragAchievement | null => {
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

  const calculateWrongTurn = (stats: AllPlayerStats): WrongTurnAchievement | null => {
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

  // The JSX for rendering the component remains completely unchanged
  return (
    <div>
      <h2>Q2 Game Log Parser 📜</h2>
      <p>This tool displays a match leaderboard and a detailed kill breakdown.</p>

      <input
        type="file"
        accept=".txt,.log"
        onChange={handleFileChange}
        style={{ margin: '20px 0' }}
      />

      {message && <p><em>{message}</em></p>}
      {
        /*
          6. Head Hunter - Убить Group Leader-а больше всех раз.
          7. Respawn Hero - Person who has most telefrag kills.
          8. Wrong turn - most deaths in lava/acid
          9. Grenadier - больше всего фрагов сделаных гранатами.
          10.Troublemaker - самая длиная серия упоминания игрока в консольном логе. (сообщения подряд).
         */
      }

      {Object.keys(playerStats).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Match Leaderboard 🏆</h3>
          <table style={{ borderCollapse: 'collapse', width: '400px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Player</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Kills</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Deaths</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(playerStats)
                .sort(([, a], [, b]) => b.kills - a.kills || a.deaths - b.deaths)
                .map(([player, stats]) => (
                  <tr key={player}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{player}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{stats.kills}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{stats.deaths}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Achievements */}
      {headHunter && (
        <div style={{ padding: '10px 15px', border: '1px solid #e0c200', backgroundColor: '#fffbe6', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🏆 Head Hunter Achievement</h3>
          <p style={{ margin: 0 }}>
            <strong>{headHunter.hunter}</strong> is the Head Hunter for killing the leader (<strong>{headHunter.leader}</strong>) {headHunter.killsOnLeader} {headHunter.killsOnLeader > 1 ? 'times' : 'time'}!
          </p>
        </div>
      )}

      {mostTelefrags ? (
          <div style={{ padding: '10px 15px', border: '1px solid #6f42c1', backgroundColor: '#f3eefc', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>🏅 Most Telefrags</h3>
            <p style={{ margin: 0 }}>
              <strong>{mostTelefrags.achievers.join(' & ')}</strong> {mostTelefrags.achievers.length > 1 ? 'share the award' : 'gets the award'} with <strong>{mostTelefrags.count}</strong> telefrags!
            </p>
          </div>
      ): (
        <div style={{ padding: '10px 15px', border: '1px solid #6f42c1', backgroundColor: '#f3eefc', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>🏅 No Telefrags</h3>
          </div>
      )}

      {wrongTurn && (
        <div style={{ padding: '10px 15px', border: '1px solid #dc3545', backgroundColor: '#fbe9eb', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🤦 Wrong Turn</h3>
          <p style={{ margin: 0 }}>
            <strong>{wrongTurn.achievers.join(' & ')}</strong> took a wrong turn {wrongTurn.count} {wrongTurn.count > 1 ? 'times' : 'time'} to earn this award.
          </p>
        </div>
      )}

      {/* Detailed stats */}
      {Object.keys(playerStats).length > 0 && (
        <div style={{ marginTop: '30px' }}>
            <h3>Kill Details 🔎</h3>
            {Object.entries(playerStats)
                .filter(([, stats]) => stats.kills > 0)
                .sort(([, a], [, b]) => b.kills - a.kills)
                .map(([player, stats]) => (
                    <div key={player} style={{ marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 5px 0' }}>{player} ({stats.kills} total kills)</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {Object.entries(stats.killBreakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([victim, count]) => (
                                    <li key={victim}>
                                        Killed <strong>{victim}</strong> {count} {count > 1 ? 'times' : 'time'}
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))
            }
        </div>
      )}
    </div>
  );
};

export default LogParser;