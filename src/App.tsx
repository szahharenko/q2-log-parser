import { Achievements } from './components/Achievements';
import { PlayerStats } from './components/PlayerStats';
import { PlayerTable } from './components/Table';
import { filterGameLines, parseGameEvents } from './utils/functions';
import type { AllPlayerStats } from './types/types';
import React, { useState } from 'react';
import { Weapons } from './components/Weapons';
import { sendLogs } from './utils/sendLogs';

const LogParser: React.FC = () => {
  const [message, setMessage] = useState<string>('Please select a log file to view its content.');
  const [playerStats, setPlayerStats] = useState<AllPlayerStats>({});
  const [weaponStats, setWeaponStats] = useState<Record<string, number> | null>(null);
  const [gameEvents, setGameEvents] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  sendLogs(['1','2'], 'https://agly.eu/hooks/q2parser/');

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

      // Extract and process game event lines from all files
      const fullContent = allFileContents.join('\n');
      const timestampRegex = /^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}\] /;
      const allLines = fullContent.split('\n').map(line => line.replace(timestampRegex, ''));
      const onlyGameEvents = filterGameLines(allLines);
      setGameEvents(onlyGameEvents);

      // Parse game events to calculate stats
      const { stats: calculatedStats, weaponStats: calculatedWeaponStats} = parseGameEvents(onlyGameEvents);

      setPlayerStats(calculatedStats);
      setWeaponStats(calculatedWeaponStats);
      setMessage(`Successfully parsed ${files.length} log file(s).`);

    } catch (error) {
      setMessage(`An error occurred: ${error}`);
      setPlayerStats({});
    }
  };

  const saveReport = async () => {
    setIsLoading(true);
    setStatus('Sending logs...');

    if(gameEvents.length === 0) {
      setStatus('No game events to send.');
      setIsLoading(false);
      return;
    }

    const response = await sendLogs(gameEvents, 'https://agly.eu/hooks/q2parser/');

    // 3. Update state based on the response
    setIsLoading(false);
    if (response.status === 'success') {
      setStatus('Logs saved successfully!');
      console.log('Server response:', response.message);
    } else {
      setStatus(`Error: ${response.message}`);
      console.error('Server error:', response.message);
    }
  };


  return (
    <div>
      <div className='hide-on-print'>
        <h2>Q2 Game Log Parser 📜</h2>
        <p>This tool displays a match leaderboard and a detailed kill breakdown.</p>
        { gameEvents.length > 0 &&
          <>
            <button onClick={saveReport} disabled={isLoading} style={{ margin: '0 10px 0 0'}}>
              {isLoading ? 'Sending...' : 'Save report'}
            </button>
            {/* Display a status message to the user */}
            {
              status &&
                <p style={{ color: status.startsWith('Error') ? 'red' : 'green' }}>
                  {status}
                </p>
            }
          </>
        }
        <input
          type="file"
          accept=".txt,.log"
          onChange={handleFileChange}
          style={{ margin: '20px 0' }}
          multiple
        />
        {message && <p><em>{message}</em></p>}
      </div>

      { Object.keys(playerStats).length > 0 &&
        <>
          <PlayerTable playerStats={playerStats}/>
          <Weapons weaponStats={weaponStats}/>
          <Achievements  playerStats={playerStats} weaponStats={weaponStats}/>
          <PlayerStats playerStats={playerStats} />
        </>
      }


    </div>
  );
};

export default LogParser;