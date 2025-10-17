import { PlayerTable } from './Table';
import { calculateHeadHunter, calculateMostGrenadeKills, calculateMostTelefrags, calculateWrongTurn, parseGameEvents } from './functions';
import type { AllPlayerStats, HeadHunterAchievement, TelefragAchievement, WrongTurnAchievement, GrenadeAchievement } from './types';
import React, { useState } from 'react';

const LogParser: React.FC = () => {
  const [message, setMessage] = useState<string>('Please select a log file to view its content.');
  const [playerStats, setPlayerStats] = useState<AllPlayerStats>({});
  const [headHunter, setHeadHunter] = useState<HeadHunterAchievement | null>(null);
  const [mostTelefrags, setMostTelefrags] = useState<TelefragAchievement | null>(null);
  const [wrongTurn, setWrongTurn] = useState<WrongTurnAchievement | null>(null);
  const [mostGrenades, setMostGrenades] = useState<GrenadeAchievement | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerStats({});
    setHeadHunter(null);
    setWrongTurn(null);

    const files = event.target.files;
    if (!files || files.length === 0) {
      setMessage('No files selected.');
      return;
    }

    setMessage(`Reading ${files.length} log file(s)...`);
    try {
      // Create an array of Promises, one for each file
      const readPromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            resolve(e.target?.result as string);
          };
          reader.onerror = () => {
            reject(`Error reading ${file.name}`);
          };
          reader.readAsText(file);
        });
      });

      // Wait for all files to be read
      const allFileContents = await Promise.all(readPromises);

      // Join the content of all files into a single string
      const fullContent = allFileContents.join('\n');

      // --- The rest of the processing is the same ---
      const timestampRegex = /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}\] /;
      const allLines = fullContent.split('\n').map(line => line.replace(timestampRegex, ''));

      // You might have multiple "Match has started!" lines. We'll just process everything.
      // Or, if you want to be more specific, you could process logs between the first
      // "Match started" and the last "Match ended" line, but for simplicity, we process all.


      // Assign achievements...
      // ... (same achievement assignment logic as before) ...
      const calculatedStats = parseGameEvents(allLines);

      setPlayerStats(calculatedStats);
      setMessage(`Successfully parsed the log.`);

      // Achievements
      setHeadHunter(calculateHeadHunter(calculatedStats));
      setMostTelefrags(calculateMostTelefrags(calculatedStats));
      setWrongTurn(calculateWrongTurn(calculatedStats));
      setMostGrenades(calculateMostGrenadeKills(calculatedStats));

    } catch (error) {
      setMessage(`An error occurred: ${error}`);
      setPlayerStats({});
    }
    /*
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const fullContent = e.target?.result as string;
      if (!fullContent) { setMessage('Error: Could not read file content.'); return; }

      const initialLines = fullContent.split('\n');
      // Create a regex to find timestamps like [YYYY-MM-DD HH:MM] at the start of a line
      const timestampRegex = /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}\] /;
      const allLines = initialLines.map(line => line.replace(timestampRegex, ''));
      const calculatedStats = parseGameEvents(allLines);

      setPlayerStats(calculatedStats);
      setMessage(`Successfully parsed the log.`);

      // Achievements
      setHeadHunter(calculateHeadHunter(calculatedStats));
      setMostTelefrags(calculateMostTelefrags(calculatedStats));
      setWrongTurn(calculateWrongTurn(calculatedStats));
      setMostGrenades(calculateMostGrenadeKills(calculatedStats));

    };
    reader.onerror = () => { setMessage('An error occurred while reading the file.'); };
    reader.readAsText(file);
    */
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
        multiple
      />

      {message && <p><em>{message}</em></p>}

      <PlayerTable playerStats={playerStats}/>

      {/* Achievements */}
      {headHunter && (
        <div style={{ padding: '10px 15px', border: '1px solid #e0c200', backgroundColor: '#fffbe6', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🏆 Head Hunter Achievement</h3>
          <p style={{ margin: 0 }}>
            <strong>{headHunter.hunter}</strong> is the Head Hunter for killing the leader (<strong>{headHunter.leader}</strong>) {headHunter.killsOnLeader} {headHunter.killsOnLeader > 1 ? 'times' : 'time'}!
          </p>
        </div>
      )}

      {mostTelefrags && (
          <div style={{ padding: '10px 15px', border: '1px solid #6f42c1', backgroundColor: '#f3eefc', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>🏅 Most Telefrags</h3>
            <p style={{ margin: 0 }}>
              <strong>{mostTelefrags.achievers.join(' & ')}</strong> {mostTelefrags.achievers.length > 1 ? 'share the award' : 'gets the award'} with <strong>{mostTelefrags.count}</strong> telefrags!
            </p>
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

      {mostGrenades && (
          <div style={{ padding: '10px 15px', border: '1px solid #28a745', backgroundColor: '#e9f7ec', borderRadius: '5px' }}>
            <h3 style={{ marginTop: 0 }}>💣 Grenadier</h3>
            <p style={{ margin: 0 }}>
              <strong>{mostGrenades.achievers.join(' & ')}</strong> earned the top spot with <strong>{mostGrenades.count}</strong> grenade kills!
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
                        <h4 style={{ margin: '0 0 5px 0' }}>{player}</h4>
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