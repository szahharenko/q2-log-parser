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
import { get } from 'http';
import { getLanguage } from './utils/getLanguage';

const LogParser: React.FC = () => {
  const [message, setMessage] = useState<string>('Please select a log file to view its content.');
  const [playerStats, setPlayerStats] = useState<AllPlayerStats>({});
  const [weaponStats, setWeaponStats] = useState<Record<string, number> | null>(null);
  const [allLines, setAllLines] = useState<string[]>([]);
  const [gameEvents, setGameEvents] = useState<string[]>([]);
  const [nonGameEvents, setNoneGameEvents] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_URL = 'https://q2.agly.eu/server/';
  const urlParams = new URLSearchParams(window.location.search);
  const reportId = urlParams.get('r');
  const lang = getLanguage();

  useEffect(() => {
    reportId && getLogs(reportId, API_URL).then(data => {
      if (data?.length) {
        const onlyGameEvents = filterGameLines(data);
        const nonGameEvents = filterNonGameLines(data);
        setAllLines(data);
        setNoneGameEvents(nonGameEvents);
        setGameEvents(onlyGameEvents);
        // Parse game events to calculate stats
        const { stats: calculatedStats, weaponStats: calculatedWeaponStats} = parseGameEvents(data, nonGameEvents);
        setPlayerStats(calculatedStats);
        setWeaponStats(calculatedWeaponStats);
        setMessage(lang === 'en' ? `Successfully loaded report.` : `Отчет успешно загружен.`);
      } else {
        setMessage((lang === 'en' ? `This report do no exist report.` : `Такого отчета не существует.`));
        //window.location.href = window.location.origin
      }
    }).catch(_e => {
      setMessage(lang === 'en' ? `This report do no exist report.` : `Такого отчета не существует.`);
     //window.location.href = window.location.origin
    });
  }, [reportId, lang]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerStats({});
    setWeaponStats(null);

    const files = event.target.files;
    if (!files || files.length === 0) {
      setMessage(lang === 'en' ? 'No files selected.': 'Файлы не выбраны.');
      return;
    }

    setMessage(lang === 'en' ? `Reading ${files.length} log file(s)...` : `Чтение ${files.length} лог файла(ов)...`);

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
      setAllLines(allLines);
      setNoneGameEvents(nonGameEvents);
      setGameEvents(onlyGameEvents);

      // Parse game events to calculate stats
      const { stats: calculatedStats, weaponStats: calculatedWeaponStats} = parseGameEvents(onlyGameEvents, nonGameEvents);

      setPlayerStats(calculatedStats);
      setWeaponStats(calculatedWeaponStats);
      setMessage(lang === 'en' ? `Successfully parsed ${files.length} log file(s).` : `Успешно проанализировано ${files.length} лог файла(ов).`);

    } catch (error) {
      setMessage(lang === 'en' ? `An error occurred: ${error}`: `Произошла ошибка: ${error}`);
      setPlayerStats({});
    }
  };

  const saveReport = async () => {
    setIsLoading(true);
    setStatus(lang === 'en' ? 'Sending logs...' : 'Отправка логов...');

    if(gameEvents.length === 0) {
      setStatus(lang === 'en' ? 'No game events to send.': 'Нет игровых событий для отправки.');
      setIsLoading(false);
      return;
    }

    const response = await sendLogs(allLines, API_URL);
    const { status: respStatus, message: respMessage, id: respId } = response;

    // 3. Update state based on the response
    setIsLoading(false);
    if (respStatus === 'success') {
      setStatus(lang === 'en' ? 'Logs saved successfully!': 'Логи успешно сохранены!');
      setTimeout(() => {
        window.location.href = window.location.href + `?lang=${lang}&r=${respId}`
      }, 1000);
    } else {
      setStatus(lang === 'en' ? `Error: ${respMessage}` : `Ошибка: ${respMessage}`);
      console.error('Server error:', respMessage);
    }
  };


  return (
    <div>
      { !reportId &&
        <div className='hide-on-print'>
          <h2>{ lang === 'en' ? 'Q2 Game Log Parser' : 'Q2 парсер игровых логов'} 📜</h2>
          <p>{ lang === 'en' ? 'This tool displays a match leaderboard and a detailed kill breakdown.' : 'Эта утилита проанализирует игровой лог и выдаст немного игровой статистики и ачивок'}</p>
          { gameEvents.length > 0 &&
            <>
              <button onClick={saveReport} disabled={isLoading} style={{ margin: '0 10px 0 0'}}>
                {isLoading ? (lang === 'en' ? 'Sending...' : 'Отправка...') : (lang === 'en' ? 'Save report' : 'Сохранить отчет')}
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
        { lang === 'en' ? 'This tool is designed & developed by' : 'Авторы '} <a href="https://t.me/Acrashik" target="_blank" rel="noopener noreferrer">Acrashik</a> and <a href="https://t.me/exeshe4ki">Exeshe4ki</a>
      </p>
    </div>
  );
};

export default LogParser;