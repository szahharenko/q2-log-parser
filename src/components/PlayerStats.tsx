import { PlayerStats as PlayerStatsType } from '../types/types';
import { getLanguage } from '../utils/getLanguage';
import { getPlayer } from '../utils/getPlayer';

interface PlayerStatsProps {
    playerStats: Record<string, PlayerStatsType>;
}

export const PlayerStats = ({playerStats}: PlayerStatsProps) => {
    const players = Object.keys(playerStats);
    const lang = getLanguage();
    const activePlayer = getPlayer();

    if (players.length === 0) return null;
    return <div className='page'>
        { lang === 'en' ?
            <h3>Kill Details 🔎</h3>
            :
            <h3>Детали убийств 🔎</h3>
        }

        <div className='player-stats'>
            {Object.entries(playerStats)
                .filter(([, stats]) => stats.kills > 0)
                .sort(([, a], [, b]) => b.kills - a.kills)
                .map(([player, stats]) => (
                    (activePlayer ? activePlayer === player.toLocaleLowerCase() : true) && <div className='player-details' key={player}>
                        <h4 style={{ margin: '0 0 5px 0' }}>{player}</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {Object.entries(stats.killBreakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([victim, count]) => (
                                    <li key={victim}>
                                        { lang === 'en' ? <>Killed <strong>{victim}</strong> {count} {count > 1 ? 'times' : 'time'}</> : <>Убил <strong>{victim}</strong> {count} раз</>}
                                    </li>
                                ))}
                        </ul>
                        { lang === 'en' ?
                            <h5 style={{ margin: '10px 0 5px 0' }}>{player} weapon stats:</h5> :
                            <h5 style={{ margin: '10px 0 5px 0' }}>Статистика по оружию {player}:</h5>
                        }
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {Object.entries(stats.weaponKillsBreakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([weapon, count]) => (
                                    <li key={weapon}>
                                        {weapon}: <strong>{count}</strong>
                                        { lang === 'en' ? <>{count > 1 ? 'kills' : 'kill'}</>  : null}
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))
            }
        </div>
    </div>
}