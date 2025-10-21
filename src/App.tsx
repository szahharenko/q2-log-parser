import { Achievements } from './Achievements';
import { PlayerStats } from './PlayerStats';
import { PlayerTable } from './Table';
import { filterGameLines, parseGameEvents } from './functions';
import type { AllPlayerStats } from './types';
import React, { useState } from 'react';

const LogParser: React.FC = () => {
  const [message, setMessage] = useState<string>('Please select a log file to view its content.');
  const [playerStats, setPlayerStats] = useState<AllPlayerStats>({});
  const [weaponStats, setWeaponStats] = useState<Record<string, number> | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerStats({});
    setWeaponStats(null);

    const files = event.target.files;
    if (!files || files.length === 0) {
      setMessage('No files selected.');
      return;
    }

    setMessage(`Reading ${files.length} log file(s)...`);

    try {

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

      const onlyGameEvents = filterGameLines(allLines);
      const { stats: calculatedStats, weaponStats: calculatedWeaponStats} = parseGameEvents(onlyGameEvents);

      setPlayerStats(calculatedStats);
      setWeaponStats(calculatedWeaponStats);
      setMessage(`Successfully parsed the log.`);

    } catch (error) {
      setMessage(`An error occurred: ${error}`);
      setPlayerStats({});
    }
  };

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

      { Object.keys(playerStats).length > 0 &&
        <>
          <PlayerTable playerStats={playerStats}/>
          <Achievements  playerStats={playerStats} weaponStats={weaponStats}/>
          <PlayerStats playerStats={playerStats} />
        </>
      }


    </div>
  );
};

export default LogParser;