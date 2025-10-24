import { Achievements } from './components/Achievements';
import { PlayerStats } from './components/PlayerStats';
import { PlayerTable } from './components/Table';
import { filterGameLines, filterNonGameLines, parseGameEvents } from './utils/functions';
import type { AllPlayerStats } from './types/types';
import React, { useEffect, useState } from 'react';
import { Weapons } from './components/Weapons';
import { sendLogs } from './utils/sendLogs';
import { getLogs } from './utils/getLogs';
import { Chats } from './components/Chats';

const LogParser: React.FC = () => {
  const [message, setMessage] = useState<string>('Please select a log file to view its content.');
  const [playerStats, setPlayerStats] = useState<AllPlayerStats>({});
  const [weaponStats, setWeaponStats] = useState<Record<string, number> | null>(null);
  const [gameEvents, setGameEvents] = useState<string[]>([]);
  const [nonGameEvents, setNoneGameEvents] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_URL = 'https://q2.agly.eu/server/';
  const reportId = window.location.search.split('?r=')[1];

  useEffect(() => {
    getLogs(reportId, API_URL).then(data => {
      if (data?.length) {
        setGameEvents(data);
        // Parse game events to calculate stats
        const { stats: calculatedStats, weaponStats: calculatedWeaponStats} = parseGameEvents(data);
        setPlayerStats(calculatedStats);
        setWeaponStats(calculatedWeaponStats);
        setMessage(`Successfully loaded report.`);
      } else {
        console.error('Nothing to show');
        //window.location.href = window.location.origin
      }
    }).catch(err => {
      console.error('Error fetching log data:', err);
     //window.location.href = window.location.origin
    });
  }, [reportId]);

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
      const nonGameEvents = filterNonGameLines(allLines);
      setNoneGameEvents(nonGameEvents);
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

    const response = await sendLogs(gameEvents, API_URL);
    const { status: respStatus, message: respMessage, id: respId } = response;

    // 3. Update state based on the response
    setIsLoading(false);
    if (respStatus === 'success') {
      setStatus('Logs saved successfully!');
      console.log('Server response:', respMessage);
      window.location.href = window.location.href + `?r=${respId}`
    } else {
      setStatus(`Error: ${respMessage}`);
      console.error('Server error:', respMessage);
    }
  };


  return (
    <div>
      { !reportId &&
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
      }

      { Object.keys(playerStats).length > 0 &&
        <>
          <PlayerTable playerStats={playerStats}/>
          <Weapons weaponStats={weaponStats}/>
          <Achievements  playerStats={playerStats} weaponStats={weaponStats} nonGameEvents={nonGameEvents}/>
          <PlayerStats playerStats={playerStats} />
        </>
      }
      <Chats nonGameEvents={nonGameEvents}/>
      <hr style={{margin: '30px 0'}}/>
      <p style={{textAlign:'center', padding: '10px'}}>
        This tool is designed & developed by <a href="https://t.me/Acrashik" target="_blank" rel="noopener noreferrer">Acrashik</a> and <a href="https://t.me/exeshe4ki">Exeshe4ki</a>.
      </p>
    </div>
  );
};

export default LogParser;