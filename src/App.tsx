import React, { useState } from 'react';

// Type definitions (unchanged from previous version)
interface KillBreakdown {
  [victimName: string]: number;
}
interface PlayerStats {
  kills: number;
  deaths: number;
  killBreakdown: KillBreakdown;
}
type AllPlayerStats = {
  [playerName: string]: PlayerStats;
};

const LogParser: React.FC = () => {
  const [logContent, setLogContent] = useState<string>('');
  const [message, setMessage] = useState<string>('Please select a log file to view its content.');
  const [playerStats, setPlayerStats] = useState<AllPlayerStats>({});
  console.log({logContent})
  // This function remains the same
  const parseGameEvents = (lines: string[]): AllPlayerStats => {
    const stats: AllPlayerStats = {};
    const ensurePlayer = (name: string) => {
      if (!stats[name]) {
        stats[name] = { kills: 0, deaths: 0, killBreakdown: {} };
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
    lines.forEach(line => {
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
          break;
        }
      }
    });
    return stats;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogContent('');
    setMessage('');
    setPlayerStats({});

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

      const startIndex = allLines.findIndex(line => line.includes('Match has started!'));

      if (startIndex !== -1) {
        const relevantLines = allLines.slice(startIndex + 1);

        // We now pass the CLEANED lines to the display and the parser
        setLogContent(relevantLines.join('\n'));
        const calculatedStats = parseGameEvents(relevantLines);
        setPlayerStats(calculatedStats);
        setMessage(`Successfully parsed the log.`);
      } else {
        setMessage('The line "Match has started!" was not found in this file.');
      }
    };
    reader.onerror = () => { setMessage('An error occurred while reading the file.'); };
    reader.readAsText(file);
  };

  // The JSX for rendering the component remains completely unchanged
  return (
    <div>
      <h2>Game Log Parser 📜</h2>
      <p>This tool displays a match leaderboard and a detailed kill breakdown.</p>

      <input
        type="file"
        accept=".txt,.log"
        onChange={handleFileChange}
        style={{ margin: '20px 0' }}
      />

      {message && <p><em>{message}</em></p>}

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