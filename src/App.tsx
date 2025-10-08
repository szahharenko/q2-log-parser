import React, { useState } from 'react';

// A type definition for our scores object for better type safety
type PlayerScores = {
  [playerName: string]: number;
};

const LogParser: React.FC = () => {
  const [logContent, setLogContent] = useState<string>('');
  const [message, setMessage] = useState<string>('Please select a log file to view its content.');

  // NEW: State to store player scores for railgun kills
  const [playerScores, setPlayerScores] = useState<PlayerScores>({});

  // NEW: This function takes an array of log lines and returns an object with player scores.
  const parseRailgunKills = (lines: string[]): PlayerScores => {
    const scores: PlayerScores = {};

    // Regex to match the pattern: "{victim} was railed by {killer}"
    const railgunKillRegex = /(.+) was railed by (.+)/;

    lines.forEach(line => {
      const match = line.match(railgunKillRegex);

      // A match is an array: [full_match, capture_group_1, capture_group_2]
      // We need the killer, which is the second capture group (match[2])
      if (match && match[2]) {
        const killer = match[2].trim(); // .trim() removes any accidental whitespace

        // If the killer is already in our scores object, add 1. Otherwise, initialize to 1.
        scores[killer] = (scores[killer] || 0) + 1;
      }
    });

    return scores;
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Reset all states on new file upload
    setLogContent('');
    setMessage('');
    setPlayerScores({});

    const file = event.target.files?.[0];

    if (!file) {
      setMessage('No file selected.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const fullContent = e.target?.result as string;

      if (!fullContent) {
        setMessage('Error: Could not read file content.');
        return;
      }

      const allLines = fullContent.split('\n');
      const startIndex = allLines.findIndex(line => line.includes('Match has started!'));

      if (startIndex !== -1) {
        const relevantLines = allLines.slice(startIndex + 1);
        setLogContent(relevantLines.join('\n'));

        // NEW: Call the parsing function with the relevant lines and set the state
        const calculatedScores = parseRailgunKills(relevantLines);
        setPlayerScores(calculatedScores);

        setMessage(`Successfully parsed the log.`);
      } else {
        setMessage('The line "Match has started!" was not found in this file.');
      }
    };

    reader.onerror = () => {
      setMessage('An error occurred while reading the file.');
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <h2>Game Log Parser 📜</h2>
      <p>This tool displays log entries and a leaderboard for railgun kills.</p>

      <input
        type="file"
        accept=".txt,.log"
        onChange={handleFileChange}
        style={{ margin: '20px 0' }}
      />

      {message && <p><em>{message}</em></p>}

      {/* NEW: Display the leaderboard if there are any scores */}
      {Object.keys(playerScores).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Railgun Kills Leaderboard 🎯</h3>
          <table style={{ borderCollapse: 'collapse', width: '300px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eee' }}>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Player</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Kills</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(playerScores)
                .sort(([, a], [, b]) => b - a) // Sort by score, highest first
                .map(([player, kills]) => (
                  <tr key={player}>
                    <td style={{ border: '1px solid #ccc', padding: '8px' }}>{player}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{kills}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {logContent && (
        <div>
          <h3>Full Parsed Log Content:</h3>
          <pre
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              backgroundColor: '#f5f5f5',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {logContent}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LogParser;