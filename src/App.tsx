import { PlayerTable } from './Table';
import { calculateHeadHunter, calculateMostBlasterKills, calculateMostEventStreak, calculateMostGrenadeKills, calculateMostTelefrags, calculateNoMercyForMinions, calculateWrongTurn, filterGameLines, parseGameEvents } from './functions';
import type { AllPlayerStats, HeadHunterAchievement, TelefragAchievement, WrongTurnAchievement, GrenadeAchievement } from './types';
import React, { useState } from 'react';

const LogParser: React.FC = () => {
  const [message, setMessage] = useState<string>('Please select a log file to view its content.');
  const [playerStats, setPlayerStats] = useState<AllPlayerStats>({});
  const [headHunter, setHeadHunter] = useState<HeadHunterAchievement | null>(null);
  const [mostTelefrags, setMostTelefrags] = useState<TelefragAchievement | null>(null);
  const [wrongTurn, setWrongTurn] = useState<WrongTurnAchievement | null>(null);
  const [mostEventStreak, setMostEventStreak] = useState<WrongTurnAchievement | null>(null);
  const [mostBully, setMostBully] = useState<HeadHunterAchievement | null>(null);
  const [mostGrenades, setMostGrenades] = useState<GrenadeAchievement | null>(null);
  const [mostBlaster, setMostBlaster] = useState<GrenadeAchievement | null>(null);
  const [weaponStats, setWeaponStats] = useState<Record<string, number> | null>(null);

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
      const onlyGameEvents = filterGameLines(allLines);
      const { stats: calculatedStats, weaponStats: calculatedWeaponStats} = parseGameEvents(onlyGameEvents);
      setWeaponStats(calculatedWeaponStats);

      setPlayerStats(calculatedStats);
      setMessage(`Successfully parsed the log.`);

      // Achievements
      setHeadHunter(calculateHeadHunter(calculatedStats));
      setMostTelefrags(calculateMostTelefrags(calculatedStats));
      setWrongTurn(calculateWrongTurn(calculatedStats));
      setMostGrenades(calculateMostGrenadeKills(calculatedStats));
      setMostBlaster(calculateMostBlasterKills(calculatedStats));
      setMostEventStreak(calculateMostEventStreak(calculatedStats));
      setMostBully(calculateNoMercyForMinions(calculatedStats)); // Reusing HeadHunter calculation for Bully

    } catch (error) {
      setMessage(`An error occurred: ${error}`);
      setPlayerStats({});
    }
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
      { /* Total weapon usage (killed by weapon) */}
      {weaponStats && (
        <div style={{ margin: '30px 0' }}>
            <h3>Combined weapon Usage Statistics 🔫</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {Object.entries(weaponStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([weapon, count]) => (
                        <li key={weapon}>
                            <strong>{weapon}</strong>: {count} {count > 1 ? 'kills' : 'kill'}
                        </li>
                    ))}
            </ul>
        </div>
      )}

      {/* Achievements */}
      {headHunter && (
        <div style={{ padding: '10px 15px', border: '1px solid #e0c200', backgroundColor: '#fffbe6', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🏆 Head Hunter</h3>
          <p style={{ margin: 0 }}>
            <strong>{headHunter.hunter}</strong> is the Head Hunter for killing the leader (<strong>{headHunter.leader}</strong>) {headHunter.killsOnLeader} {headHunter.killsOnLeader > 1 ? 'times' : 'time'}!
          </p>
        </div>
      )}

      {mostTelefrags && (
          <div style={{ padding: '10px 15px', border: '1px solid #6f42c1', backgroundColor: '#f3eefc', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>🏅 Respawn Hero</h3>
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
          <div style={{ padding: '10px 15px', border: '1px solid #28a745', backgroundColor: '#e9f7ec', borderRadius: '5px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0 }}>💣 Grenadier</h3>
            <p style={{ margin: 0 }}>
              <strong>{mostGrenades.achievers.join(' & ')}</strong> earned the top spot with <strong>{mostGrenades.count}</strong> grenade kills!
            </p>
          </div>
      )}

      {mostEventStreak && (
        <div style={{ padding: '10px 15px', border: '1px solid #aea601ff', backgroundColor: '#feffadff', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🔥 Troublemaker</h3>
          <p style={{ margin: 0 }}>
            <strong>{mostEventStreak.achievers.join(' & ')}</strong> caused chaos with an event streak of <strong>{mostEventStreak.count}</strong>!
          </p>
        </div>
      )}

      { /*No Mercy for Minions */ }
      {mostBully && (
        <div style={{ padding: '10px 15px', border: '1px solid #ff5733', backgroundColor: '#ffe6e1', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>👊 Bully</h3>
          <p style={{ margin: 0 }}>
            <strong>{mostBully.hunter}</strong> Has no mercy for Minions by killing <strong>{mostBully.leader}</strong> {mostBully.killsOnLeader} {mostBully.killsOnLeader > 1 ? 'times' : 'time'}!
          </p>
        </div>
      )}

      { /* Blaster kills achievement could be added here similarly */ }
      {mostBlaster && (
        <div style={{ padding: '10px 15px', border: '1px solid #17a2b8', backgroundColor: '#d1f0f7', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ marginTop: 0 }}>🔫 Optimist</h3>
          <p style={{ margin: 0 }}>
            <strong>{mostBlaster.achievers.join(' & ')}</strong> tops the charts with <strong>{mostBlaster.count}</strong> blaster kills!
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
                        {/* weaponKillsBreakdown */ }
                        <h5 style={{ margin: '10px 0 5px 0' }}>{player} weapon stats:</h5>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {Object.entries(stats.weaponKillsBreakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([weapon, count]) => (
                                    <li key={weapon}>
                                        {weapon}: <strong>{count}</strong> {count > 1 ? 'kills' : 'kill'}
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